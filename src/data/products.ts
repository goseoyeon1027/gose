import deskMatImage from "@/assets/products/desk-mat.jpg";
import monitorShelfImage from "@/assets/products/monitor-shelf.jpg";
import storageBoxImage from "@/assets/products/storage-box.jpg";
import rgbLightImage from "@/assets/products/rgb-light.jpg";
import cableHolderImage from "@/assets/products/cable-holder.jpg";

export type Category = "all" | "desk-mats" | "storage" | "lighting" | "stands" | "accessories";

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category: Category;
}

export const products: Product[] = [
  {
    id: 1,
    name: "무선 충전 모듈형 펠트 데스크 매트",
    description: "포근한 펠트 감성에 마그네틱 무선 충전기를 톡! 복잡한 선 없이 스마트폰부터 이어폰까지 한 번에 정리하고, 당신의 1평 책상을 프리미엄 스튜디오로 바꿔보세요!",
    image: deskMatImage,
    price: "89,000원",
    category: "desk-mats",
  },
  {
    id: 2,
    name: "모니터 상단 '스마트 스페이스' 선반",
    description: "모니터 위 숨겨진 15cm를 찾아드려요! 바닥에 굴러다니던 외장하드와 피규어를 위로 쓱- 올리면 좁았던 내 책상이 마법처럼 넓어지는 기적!",
    image: monitorShelfImage,
    price: "49,000원",
    category: "stands",
  },
  {
    id: 3,
    name: "클램프식 '회전형' 언더 데스크 수납함",
    description: "구멍 뚫지 말고 슥- 돌려서 깔끔하게 숨기세요! 책상 위 잡동사니를 360도 회전 수납함 속에 쏙 넣으면, 1초 만에 미니멀 스튜디오 데스크가 탄생합니다!",
    image: storageBoxImage,
    price: "39,000원",
    category: "storage",
  },
  {
    id: 4,
    name: "사운드 반응형 RGB LED 라이트 바 (AI 연동)",
    description: "분위기 깡패 등장! 음악과 목소리에 반응해서 화려하게 춤추는 RGB 라이트가 당신의 작업실을 완벽한 핫플레이스로 바꿔줄 거예요!",
    image: rgbLightImage,
    price: "59,000원",
    category: "lighting",
  },
  {
    id: 5,
    name: "투명 아크릴 '모듈형' 케이블 홀더",
    description: "데스크테리어의 완성은 한 끗 차이! 뱀처럼 꼬여있는 지저분한 케이블들을 투명하고 영롱한 홀더로 꽉 잡아주세요!",
    image: cableHolderImage,
    price: "19,000원",
    category: "storage",
  },
  {
    id: 6,
    name: "알루미늄 노트북 스탠드 (각도 조절형)",
    description: "목과 어깨를 구해주는 히어로! 노트북을 눈높이로 올려주는 알루미늄 스탠드로 하루 종일 편안하게 작업하세요. 각도는 내 마음대로!",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
    price: "69,000원",
    category: "stands",
  },
  {
    id: 7,
    name: "게이밍 마우스 패드 (대형 사이즈)",
    description: "부드러운 움직임의 시작! 넓은 공간에서 자유롭게 움직이는 마우스 패드로 게임도 작업도 더욱 정확하게! 미끄럼 방지 처리 완료!",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&h=800&fit=crop",
    price: "29,000원",
    category: "desk-mats",
  },
  {
    id: 8,
    name: "USB-C 멀티 허브 (7in1)",
    description: "포트 부족의 해결사! USB-C, HDMI, SD카드 슬롯까지 한 번에! 노트북 하나로 모든 기기를 연결하는 마법의 허브!",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop",
    price: "45,000원",
    category: "accessories",
  },
  {
    id: 9,
    name: "스마트 LED 책상 조명 (무선 충전 내장)",
    description: "밝기와 색온도 조절이 자유로운 스마트 조명! 무선 충전 패드까지 내장되어 있어 스마트폰도 충전하고 책상도 밝히는 일석이조!",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    price: "79,000원",
    category: "lighting",
  },
  {
    id: 10,
    name: "모니터 암 (듀얼 모니터 지원)",
    description: "책상 공간을 두 배로! 모니터를 공중에 띄워서 책상 위 공간을 확보하세요. 듀얼 모니터도 자유롭게 배치 가능!",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop",
    price: "129,000원",
    category: "stands",
  },
  {
    id: 11,
    name: "키보드 받침대 (목받침 포함)",
    description: "손목과 목을 동시에 케어! 키보드를 올려서 타이핑 자세를 개선하고, 목받침까지 있어 장시간 작업도 편안하게!",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=800&fit=crop",
    price: "35,000원",
    category: "stands",
  },
  {
    id: 12,
    name: "무선 블루투스 마우스 (인체공학형)",
    description: "손에 착 달라붙는 편안함! 인체공학 디자인으로 장시간 사용해도 손목이 편안한 무선 마우스. 배터리는 1년 사용 가능!",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop",
    price: "89,000원",
    category: "accessories",
  },
  {
    id: 13,
    name: "헤드폰 스탠드 (무선 충전 + RGB)",
    description: "헤드폰도 예쁘게 보관하고, 무선 충전도 하고, RGB 조명까지! 데스크테리어의 완성은 바로 이거예요!",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    price: "55,000원",
    category: "lighting",
  },
  {
    id: 14,
    name: "스마트 플러그 (음성 제어)",
    description: "알렉사, 시리와 대화하듯이! 음성으로 전원을 켜고 끄는 스마트 플러그로 책상 조명부터 선풍기까지 스마트하게 관리하세요!",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
    price: "25,000원",
    category: "accessories",
  },
  {
    id: 15,
    name: "데스크 오거나이저 트레이 (3단 수납)",
    description: "작은 물건도 깔끔하게! 연필, 클립, USB까지 책상 위 작은 물건들을 카테고리별로 정리하는 3단 수납 트레이!",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=800&fit=crop",
    price: "32,000원",
    category: "storage",
  },
  {
    id: 16,
    name: "무선 키보드 (저소음 기계식)",
    description: "타이핑의 쾌감을 느껴보세요! 저소음 기계식 키보드로 조용하면서도 만족스러운 타이핑 경험을! 무선으로 깔끔하게!",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop",
    price: "149,000원",
    category: "accessories",
  },
  {
    id: 17,
    name: "모니터 받침대 (서랍형)",
    description: "모니터 아래 공간 활용 끝판왕! 모니터를 올리고 아래 공간은 서랍으로 활용하는 2in1 받침대! 작은 물건 보관의 달인!",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop",
    price: "42,000원",
    category: "storage",
  },
  {
    id: 18,
    name: "USB 케이블 정리 클립 (10개 세트)",
    description: "케이블 정리의 달인! USB 케이블부터 충전선까지 깔끔하게 정리하는 클립 세트. 책상이 한눈에 보이는 기적!",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop",
    price: "12,000원",
    category: "storage",
  },
  {
    id: 19,
    name: "무선 이어폰 충전 도크 (3in1)",
    description: "이어폰, 워치, 스마트폰 한 번에! 3개 기기를 동시에 충전하는 무선 충전 도크. 책상 위 충전의 혁명!",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop",
    price: "65,000원",
    category: "accessories",
  },
  {
    id: 20,
    name: "데스크 팬 (USB 무선)",
    description: "더위를 날려버리는 미니 선풍기! USB로 작동하는 조용한 데스크 팬으로 시원한 작업 환경을 만들어보세요!",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20315?w=800&h=800&fit=crop",
    price: "28,000원",
    category: "accessories",
  },
  {
    id: 21,
    name: "책상 하부 서랍 유닛 (롤러형)",
    description: "책상 아래 공간을 100% 활용! 롤러로 부드럽게 열리는 서랍 유닛으로 파일과 문서를 깔끔하게 정리하세요!",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
    price: "75,000원",
    category: "storage",
  },
  {
    id: 22,
    name: "스마트 웹캠 (4K 자동 추적)",
    description: "화상회의의 프로! 4K 화질과 자동 추적 기능으로 언제 어디서나 완벽한 화상회의를! 프라이버시 커버까지 포함!",
    image: "https://images.unsplash.com/photo-1601972602237-8c79241f0c86?w=800&h=800&fit=crop",
    price: "189,000원",
    category: "accessories",
  },
  {
    id: 23,
    name: "데스크 매트 확장형 (L자형)",
    description: "큰 책상도 한 번에! L자형 데스크 매트로 넓은 책상 전체를 감싸는 프리미엄 감성! 마우스 움직임도 부드럽게!",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop",
    price: "95,000원",
    category: "desk-mats",
  },
  {
    id: 24,
    name: "무선 스피커 (RGB 조명 내장)",
    description: "음악과 빛의 하모니! RGB 조명이 음악에 맞춰 춤추는 무선 스피커로 작업실을 클럽처럼 만들어보세요!",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
    price: "125,000원",
    category: "lighting",
  },
];

// 상품 ID로 상품 찾기
export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

