export const validateField = (name, value, formData) => {
  switch (name) {
    case 'phoneOrEmail':
      if (!value.trim()) return 'Обязательное поле';
      if (/[^0-9+]/.test(value)) {
        if (value.includes('@')) {
          const [localPart, domainPart] = value.split('@');
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
          const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
          
          if (!emailRegex.test(localPart) || !domainRegex.test(domainPart)) {
            return 'Введите корректный email';
          }
          return '';
        }
        return 'Введите корректный email или номер телефона';
      }
      const phoneRegex = /^\+?\d{10,15}$/;
      return phoneRegex.test(value)
        ? ''
        : 'Номер телефона должен содержать 10-15 цифр';
    
    case 'password':
      if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
      if (!/[A-Z]/.test(value)) return 'Должна быть хотя бы одна заглавная буква';
      if (!/\d/.test(value)) return 'Должна быть хотя бы одна цифра';
      return '';
    
    case 'confirmPassword':
      return value === formData.password
        ? ''
        : 'Пароли не совпадают';
    
    case 'fullName':
      if (!value.trim()) return 'Обязательное поле';
      const nameParts = value.trim().split(/\s+/).filter(part => part !== '');
      if (nameParts.length < 2) return 'Введите полное ФИО (минимум 2 слова)';
      if (nameParts.length > 3) return 'Максимум 3 слова (Фамилия Имя Отчество)';
      if (!/^[а-яА-ЯёЁa-zA-Z-]+$/.test(nameParts[0]) || !/^[а-яА-ЯёЁa-zA-Z-]+$/.test(nameParts[1])) {
        return 'Имя и фамилия могут содержать только буквы и дефисы';
      }
      if (nameParts[2] && !/^[а-яА-ЯёЁa-zA-Z-]+$/.test(nameParts[2])) {
        return 'Отчество может содержать только буквы и дефисы';
      }
      return '';
    
    case 'username':
      if (!value.trim()) return 'Обязательное поле';
      if (value.length < 3) return 'Минимум 3 символа';
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Только латинские буквы, цифры и _';
      }
      return '';
    
    default:
      return '';
  }
};

export const isFormValid = (errors) => {
  return Object.values(errors).every(error => error === '');
};