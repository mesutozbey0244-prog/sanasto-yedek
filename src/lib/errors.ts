interface DatabaseErrorLike {
  code?: string;
}

const NETWORK_MESSAGE = 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.';

export function describeError(error: unknown): string {
  if (error instanceof TypeError) return NETWORK_MESSAGE;
  const code = (error as DatabaseErrorLike | null)?.code;
  if (code === '23505') return 'Bu isimde bir kayıt zaten var.';
  if (code === '42501') return 'Bu işlem için yetkiniz yok. Lütfen tekrar giriş yapın.';
  return 'İşlem tamamlanamadı. Lütfen tekrar deneyin.';
}

export function describeAuthError(error: unknown): string {
  if (error instanceof TypeError) return NETWORK_MESSAGE;
  const message = error instanceof Error ? error.message : '';
  if (message.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (message.includes('User already registered')) return 'Bu e-posta ile zaten bir hesap var.';
  if (message.includes('Password should be at least')) return 'Şifre en az 6 karakter olmalı.';
  if (message.includes('Email address') && message.includes('invalid')) return 'E-posta adresi geçersiz.';
  if (message.includes('rate limit')) return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyin.';
  if (message) return message;
  return 'Giriş yapılamadı. Lütfen tekrar deneyin.';
}
