export type ProductCategory = '전체' | '테이블웨어' | '조명' | '패브릭';

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, '전체'>;
  price: number;
  note?: string;
  summary: string;
  description: string;
  material: string;
  dimensions: string;
  options: string[];
  image: string;
}

export const HERO_IMAGE =
  '/src/assets/images/hero_mono_objet_living_1795058321243.jpg';

export const CATEGORIES: ProductCategory[] = [
  '전체',
  '테이블웨어',
  '조명',
  '패브릭',
];

export const PRODUCTS: Product[] = [
  {
    id: 'ceramic-drip-mug',
    name: '백자 물레 핸드드립 머그',
    category: '테이블웨어',
    price: 34000,
    note: '베스트',
    summary: '손끝에 부드럽게 감기는 무광 백자 머그',
    description:
      '경기도 이천 공방에서 물레로 하나씩 빚어낸 백자 머그입니다. 은은한 철점과 차분한 무광 유약이 커피 본연의 색감을 돋보이게 하며, 두툼한 입술선으로 보온성이 뛰어납니다.',
    material: '국산 백자토 · 무광 유약',
    dimensions: 'Ø 88 × H 92 mm (320 ml)',
    options: ['미백 화이트', '내추럴 스톤'],
    image: '/src/assets/images/product_ceramic_mug_1795058322117.jpg',
  },
  {
    id: 'stoneware-dinner-plate',
    name: '스톤웨어 디너 플레이트 2P',
    category: '테이블웨어',
    price: 58000,
    note: '신상품',
    summary: '절제된 림 라인의 2인 디너 접시 세트',
    description:
      '한식과 양식 모두 단정하게 담아내는 도브 그레이 톤의 스톤웨어 플레이트 2종 세트입니다. 소스가 흐르지 않는 낮은 턱과 식기세척기 사용이 가능한 고온 소성 마감을 적용했습니다.',
    material: '고온 소성 스톤웨어',
    dimensions: '대 Ø 265 mm · 중 Ø 210 mm',
    options: ['도브 그레이', '웜 아이보리'],
    image: '/src/assets/images/product_stoneware_plate_1795058320593.jpg',
  },
  {
    id: 'anodized-table-lamp',
    name: '브러시드 알루미늄 테이블 램프',
    category: '조명',
    price: 168000,
    note: '베스트',
    summary: '은은한 하향광을 비추는 금속 데스크 조명',
    description:
      '결을 살린 아노다이징 알루미늄 바디와 기하학적 돔 갓이 조화를 이루는 테이블 램프입니다. 눈부심 없이 책상과 침대 협탁을 감싸는 2700K 전구색 LED 모듈이 내장되어 있습니다.',
    material: '아노다이징 알루미늄 · 패브릭 코드',
    dimensions: 'Ø 195 × H 310 mm',
    options: ['브러시드 실버', '매트 차콜'],
    image: '/src/assets/images/product_aluminum_lamp_1795058322328.jpg',
  },
  {
    id: 'opal-glass-lamp',
    name: '오팔 글라스 무드 램프',
    category: '조명',
    price: 124000,
    note: '소량 입고',
    summary: '부드럽게 퍼지는 반투명 유리 구 조명',
    description:
      '입으로 불어 만든 무광 오팔 유리 쉐이드와 슬림한 무광 스틸 베이스로 완성한 무드 조명입니다. 3단계 터치 디밍을 지원해 저녁 시간의 조도를 섬세하게 조절할 수 있습니다.',
    material: '무광 오팔 글라스 · 분체도장 스틸',
    dimensions: 'Ø 180 × H 255 mm',
    options: ['스틸 차콜', '웜 그레이'],
    image: '/src/assets/images/product_opal_lamp_1795058322906.jpg',
  },
  {
    id: 'washed-linen-blanket',
    name: '워시드 린넨 소파 블랭킷',
    category: '패브릭',
    price: 89000,
    summary: '사계절 쾌적한 유럽산 헤비 린넨 100%',
    description:
      '바이오 워싱 공정을 거쳐 처음부터 부드러운 촉감을 느낄 수 있는 헤비 린넨 블랭킷입니다. 소파 위에 무심히 걸쳐두기만 해도 공간에 차분한 질감을 더해줍니다.',
    material: '유럽산 린넨 100% (240 GSM)',
    dimensions: '140 × 200 cm',
    options: ['스톤 플랙스', '오트밀 베이지'],
    image: '/src/assets/images/product_linen_blanket_1795058321866.jpg',
  },
  {
    id: 'heavy-cotton-cushion',
    name: '헤비 코튼 플랜지 쿠션',
    category: '패브릭',
    price: 46000,
    note: '신상품',
    summary: '탄탄한 20수 고밀도 오가닉 코튼 커버 + 솜',
    description:
      '날개 봉제 마감으로 형태가 무너지지 않는 고밀도 오가닉 코튼 쿠션입니다. 복원력이 우수한 항균 마이크로화이버 솜이 함께 구성되어 바로 사용할 수 있습니다.',
    material: '오가닉 코튼 100% · 국내산 솜 포함',
    dimensions: '50 × 50 cm',
    options: ['슬레이트 차콜', '페블 그레이'],
    image: '/src/assets/images/product_cotton_cushion_1795058322158.jpg',
  },
];

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
