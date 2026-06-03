/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色调——粉色系
        pink: {
          50: '#FFF0F5',   // 最浅背景
          100: '#FFD6E7',
          200: '#FFB3D1',  // 封面角标、淡底
          300: '#FF8DB8',
          400: '#FF6B9D',  // 主品牌色（按钮、选中态）
          500: '#FF4785',
          600: '#E91E8C',  // 深强调（重要文字、徽章）
          700: '#C2006F',
          800: '#9A0057',
          900: '#720042',
        },
        // 中性色
        surface: '#FFFFFF',
        background: '#FFF0F5',
        card: '#FFFFFF',
        border: '#FFD6E7',
        textPrimary: '#2D1B2E',
        textSecondary: '#A0608A',
        textDisabled: '#D4B0C5',
      },
      fontFamily: {
        round: ['System'],
      },
      borderRadius: {
        card: '12',
        btn: '8',
        tag: '4',
      },
      spacing: {
        'card-gap': '3',
        'screen-padding': '4',
      },
    },
  },
  plugins: [],
};
