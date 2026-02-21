-- ============================================
-- STUDIO 101 Supabase 데이터베이스 설정
-- ============================================

-- 1. profiles 테이블 생성
-- 사용자 프로필 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. products 테이블 생성
-- 상품 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. chat_messages 테이블 생성
-- 채팅 메시지를 저장하는 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. payments 테이블 생성
-- 결제 내역을 저장하는 테이블
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- 6. Row Level Security (RLS) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 7. profiles 테이블 RLS 정책

-- 사용자는 자신의 프로필만 조회 가능
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 새 사용자 가입 시 자동으로 프로필 생성 (트리거 사용)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성: 새 사용자 가입 시 자동으로 프로필 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- products 테이블 updated_at 자동 업데이트 트리거
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. products 테이블 RLS 정책

-- 모든 사용자는 상품 정보를 조회 가능
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- 관리자만 상품 추가 가능
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 관리자만 상품 수정 가능
DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 관리자만 상품 삭제 가능
DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- 9. chat_messages 테이블 RLS 정책

-- 모든 사용자는 자신의 채팅 메시지를 조회 가능
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (
    user_id IS NULL OR 
    auth.uid() = user_id OR
    sender = 'bot'
  );

-- 모든 사용자는 채팅 메시지를 추가 가능 (비로그인 사용자도 가능)
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;
CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

-- 10. payments 테이블 RLS 정책

-- 사용자는 자신의 결제 내역만 조회 가능
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 결제만 추가 가능
DROP POLICY IF EXISTS "Users can insert their own payments" ON payments;
CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 결제 내역 조회 가능 (선택사항)
-- CREATE POLICY "Admins can view all payments"
--   ON payments FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM auth.users
--       WHERE auth.users.id = auth.uid()
--       AND auth.users.raw_user_meta_data->>'role' = 'admin'
--     )
--   );

-- 11. 함수 생성: 상품별 결제 횟수 집계 (제거됨 - 보안상 클라이언트에서 직접 계산)
-- SECURITY DEFINER 경고를 피하기 위해 함수 대신 클라이언트에서 직접 계산합니다.
-- 주의: 이 함수는 보안상 제거되었습니다. 
-- 대신 클라이언트 측에서 getProductPurchaseCounts() 함수를 사용하세요.

-- 12. 뷰 생성: 상품별 통계 (제거됨 - 보안상 클라이언트에서 직접 계산)
-- SECURITY DEFINER 경고를 피하기 위해 뷰를 제거합니다.
-- 주의: 이 뷰는 보안상 제거되었습니다.
-- 대신 클라이언트 측에서 getProductPurchaseCounts() 함수를 사용하세요.

-- 기존 뷰가 있다면 삭제
DROP VIEW IF EXISTS product_statistics;

-- 13. 주석 추가
COMMENT ON TABLE profiles IS '사용자 프로필 정보를 저장하는 테이블';
COMMENT ON COLUMN profiles.id IS '사용자 ID (auth.users 참조)';
COMMENT ON COLUMN profiles.name IS '사용자 이름';
COMMENT ON COLUMN profiles.email IS '사용자 이메일';
COMMENT ON COLUMN profiles.avatar_url IS '프로필 사진 URL';
COMMENT ON COLUMN profiles.created_at IS '프로필 생성 시간';
COMMENT ON COLUMN profiles.updated_at IS '프로필 수정 시간';

COMMENT ON TABLE products IS '상품 정보를 저장하는 테이블';
COMMENT ON COLUMN products.id IS '상품 고유 ID';
COMMENT ON COLUMN products.name IS '상품 이름';
COMMENT ON COLUMN products.description IS '상품 설명';
COMMENT ON COLUMN products.image IS '상품 이미지 URL';
COMMENT ON COLUMN products.price IS '상품 가격 (원 단위)';
COMMENT ON COLUMN products.category IS '상품 카테고리';
COMMENT ON COLUMN products.created_at IS '상품 생성 시간';
COMMENT ON COLUMN products.updated_at IS '상품 수정 시간';

COMMENT ON TABLE chat_messages IS '채팅 메시지를 저장하는 테이블';
COMMENT ON COLUMN chat_messages.id IS '메시지 고유 ID';
COMMENT ON COLUMN chat_messages.user_id IS '사용자 ID (비로그인 사용자는 NULL)';
COMMENT ON COLUMN chat_messages.session_id IS '채팅 세션 ID (브라우저별 고유값)';
COMMENT ON COLUMN chat_messages.message IS '메시지 내용';
COMMENT ON COLUMN chat_messages.sender IS '발신자 (user 또는 bot)';
COMMENT ON COLUMN chat_messages.created_at IS '메시지 생성 시간';

COMMENT ON TABLE payments IS '사용자 결제 내역을 저장하는 테이블';
COMMENT ON COLUMN payments.id IS '결제 고유 ID';
COMMENT ON COLUMN payments.user_id IS '결제한 사용자 ID (auth.users 참조)';
COMMENT ON COLUMN payments.items IS '결제한 상품 목록 (JSON 배열)';
COMMENT ON COLUMN payments.total_amount IS '총 결제 금액 (원 단위)';
COMMENT ON COLUMN payments.created_at IS '결제 생성 시간';

-- ============================================
-- 테스트 데이터 삽입 (개발용, 선택사항)
-- ============================================
-- 주의: 실제 프로덕션에서는 이 부분을 제거하거나 주석 처리하세요

-- 테스트 데이터는 실제 사용자 ID가 필요하므로
-- Supabase 대시보드에서 직접 삽입하거나
-- 애플리케이션을 통해 생성하는 것을 권장합니다.

-- ============================================
-- 확인 쿼리
-- ============================================

-- 테이블이 제대로 생성되었는지 확인
-- SELECT * FROM products LIMIT 10;
-- SELECT * FROM chat_messages LIMIT 10;
-- SELECT * FROM payments LIMIT 10;

-- RLS 정책이 활성화되었는지 확인
-- SELECT tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('products', 'chat_messages', 'payments');

-- 상품별 결제 횟수 확인 (클라이언트에서 직접 계산)
-- 클라이언트 측 getProductPurchaseCounts() 함수를 사용하세요.
-- SELECT items FROM payments;

