function detectPlatform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

const STEPS_BY_PLATFORM: Record<'ios' | 'android' | 'desktop', string[]> = {
  ios: [
    'Mở Cài đặt (Settings) trên iPhone/iPad',
    'Vào Quyền riêng tư & Bảo mật → Dịch vụ định vị, đảm bảo đang bật',
    'Cuộn xuống tìm trình duyệt bạn đang dùng (Safari/Chrome...) và chọn "Hỏi lần kế" hoặc "Trong khi dùng ứng dụng"',
    'Quay lại trang này và bấm "Gần tôi" lại',
  ],
  android: [
    'Bấm vào biểu tượng khóa hoặc chữ "i" cạnh địa chỉ trang web',
    'Chọn Quyền (Permissions) hoặc Cài đặt trang web',
    'Tìm mục Vị trí (Location) và chọn Cho phép (Allow)',
    'Tải lại trang và bấm "Gần tôi" lại',
  ],
  desktop: [
    'Bấm vào biểu tượng khóa cạnh địa chỉ trang web trên trình duyệt',
    'Chọn Cài đặt trang web (Site settings)',
    'Tìm mục Vị trí (Location) và đổi thành Cho phép (Allow)',
    'Tải lại trang và bấm "Gần tôi" lại',
  ],
}

export function locationPermissionGuideSteps(): string[] {
  return STEPS_BY_PLATFORM[detectPlatform()]
}
