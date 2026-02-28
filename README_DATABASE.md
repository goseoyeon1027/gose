# 데이터베이스 설정 가이드

## Supabase 설정 방법

### 1. Supabase 대시보드 접속
1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택: `vehkwwlmwxyslxaxijwm`

### 2. SQL Editor에서 실행
1. 대시보드 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 버튼 클릭
3. `supabase_setup.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 3. 테이블 확인
1. 대시보드 왼쪽 메뉴에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - `products` 테이블
   - `payments` 테이블

### 4. RLS 정책 확인
1. `profiles` 테이블 선택
   - **Policies** 탭에서 다음 정책 확인:
     - `Users can view their own profile` (SELECT)
     - `Users can update their own profile` (UPDATE)
2. `products` 테이블 선택
   - **Policies** 탭에서 다음 정책 확인:
     - `Anyone can view products` (SELECT)
     - `Admins can insert products` (INSERT)
     - `Admins can update products` (UPDATE)
     - `Admins can delete products` (DELETE)
3. `payments` 테이블 선택
   - **Policies** 탭에서 다음 정책 확인:
     - `Users can view their own payments` (SELECT)
     - `Users can insert their own payments` (INSERT)

### 5. 트리거 확인
1. 대시보드에서 **Database** > **Functions** 클릭
2. 다음 함수들이 생성되었는지 확인:
   - `handle_new_user` 함수
   - `update_updated_at_column` 함수
3. **Database** > **Triggers** 클릭
4. 다음 트리거들이 생성되었는지 확인:
   - `on_auth_user_created` 트리거 (profiles 테이블)
   - `update_products_updated_at` 트리거 (products 테이블)

## 테이블 구조

### profiles 테이블
사용자 프로필 정보를 저장하는 테이블입니다. 회원가입 시 자동으로 생성됩니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 사용자 ID (auth.users 참조, Primary Key) |
| name | TEXT | 사용자 이름 |
| email | TEXT | 사용자 이메일 |
| avatar_url | TEXT | 프로필 사진 URL (선택사항) |
| created_at | TIMESTAMP | 프로필 생성 시간 (자동 생성) |
| updated_at | TIMESTAMP | 프로필 수정 시간 (자동 생성) |

### products 테이블
상품 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL | 상품 고유 ID (Primary Key, 자동 증가) |
| name | TEXT | 상품 이름 (필수) |
| description | TEXT | 상품 설명 |
| image | TEXT | 상품 이미지 URL (필수) |
| price | INTEGER | 상품 가격 (원 단위, 필수) |
| category | TEXT | 상품 카테고리 (필수) |
| created_at | TIMESTAMP | 상품 생성 시간 (자동 생성) |
| updated_at | TIMESTAMP | 상품 수정 시간 (자동 생성, 업데이트 시 자동 갱신) |

### payments 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 결제 고유 ID (자동 생성) |
| user_id | UUID | 결제한 사용자 ID (auth.users 참조) |
| items | JSONB | 결제한 상품 목록 (배열) |
| total_amount | INTEGER | 총 결제 금액 (원 단위) |
| created_at | TIMESTAMP | 결제 생성 시간 (자동 생성) |

### items JSONB 구조 예시
```json
[
  {
    "product_id": 1,
    "product_name": "무선 충전 모듈형 펠트 데스크 매트",
    "product_image": "/path/to/image.jpg",
    "price": 89000,
    "quantity": 2
  },
  {
    "product_id": 3,
    "product_name": "클램프식 '회전형' 언더 데스크 수납함",
    "product_image": "/path/to/image.jpg",
    "price": 39000,
    "quantity": 1
  }
]
```

## 함수 및 뷰

### ⚠️ 보안상 함수 및 뷰 제거됨
SECURITY DEFINER 경고를 피하기 위해 데이터베이스 함수와 뷰는 제거되었습니다.

대신 **클라이언트 측에서 직접 계산**합니다:
- `src/lib/payments.ts`의 `getProductPurchaseCounts()` 함수 사용
- RLS 정책에 따라 각 사용자는 자신의 결제 내역만 조회 가능
- 베스트셀러 통계는 클라이언트에서 모든 결제 내역을 조회하여 계산

**참고:** 
- 프로덕션 환경에서는 서비스 역할(service role) 키를 사용하여 서버 측에서 통계를 계산하는 것을 권장합니다.

## 보안 설정

### Row Level Security (RLS)

#### products 테이블
- 모든 사용자는 상품 정보를 조회 가능 (SELECT)
- 관리자만 상품 추가/수정/삭제 가능 (INSERT/UPDATE/DELETE)
- 관리자 권한은 `auth.users.raw_user_meta_data->>'role' = 'admin'`으로 확인

#### payments 테이블
- 모든 사용자는 자신의 결제 내역만 조회 가능
- 모든 사용자는 자신의 결제만 추가 가능
- 다른 사용자의 결제 내역은 조회 불가

### 인덱스
- `products.category` 인덱스: 카테고리별 조회 성능 향상
- `products.created_at` 인덱스: 시간순 정렬 성능 향상
- `payments.user_id` 인덱스: 사용자별 조회 성능 향상
- `payments.created_at` 인덱스: 시간순 정렬 성능 향상

## 문제 해결

### 오류: "relation already exists"
- 테이블이 이미 존재하는 경우입니다.
- `CREATE TABLE IF NOT EXISTS` 구문을 사용했으므로 안전하게 실행됩니다.
- 기존 테이블을 삭제하려면: `DROP TABLE IF EXISTS payments CASCADE;`

### 오류: "permission denied"
- RLS 정책이 제대로 설정되지 않았을 수 있습니다.
- SQL Editor에서 정책을 다시 확인하세요.

### 테스트 데이터 삽입

#### products 테이블
관리자 권한이 있는 사용자로 로그인한 후, Supabase 대시보드의 Table Editor에서 직접 상품을 추가하거나, 애플리케이션을 통해 추가할 수 있습니다.

#### payments 테이블
실제 사용자 ID가 필요하므로, 애플리케이션을 통해 회원가입 후 결제를 진행하는 것을 권장합니다.

## 추가 설정 (선택사항)

### 관리자 권한 설정
관리자 권한을 부여하려면 Supabase 대시보드에서:
1. **Authentication** > **Users** 메뉴로 이동
2. 관리자로 설정할 사용자 선택
3. **User Metadata**에서 `role` 필드를 `admin`으로 설정

또는 SQL Editor에서:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin-email@example.com';
```

### 관리자 권한 추가 (payments 테이블)
관리자가 모든 결제 내역을 조회할 수 있도록 하려면, SQL 파일의 주석 처리된 관리자 정책을 활성화하세요.

### 백업 설정
Supabase 대시보드에서 자동 백업을 설정할 수 있습니다:
1. **Settings** > **Database** > **Backups**
2. 백업 스케줄 설정

