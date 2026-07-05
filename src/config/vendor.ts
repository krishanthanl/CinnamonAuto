export const vendor = {
  shopName: 'Spare Parts Shop',
  tagline:
    'We produce and sell only professional parts. High quality and fair price — an unbeaten combination for every driver.',
  phone: '1-800-1234-567',
  whatsapp: '1234567890',
  email: 'info@sparepartshop.example',
  address: '4578 Marmora St, San Francisco D04 89GR',
} as const

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(message)}`
}

export function getPhoneUrl() {
  return `tel:${vendor.phone.replace(/\s/g, '')}`
}

export function getPartInquiryMessage(partName: string, partId: string) {
  return `Hi, I'm interested in: ${partName} (ID: ${partId})`
}
