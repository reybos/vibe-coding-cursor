# Быстрый старт с Supabase

## 1. Установка зависимостей
```bash
npm install
```

## 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте URL и anon key из настроек проекта
3. Создайте файл `.env.local` в корне проекта:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 3. Создание таблицы

Выполните SQL в Supabase SQL Editor:
```sql
CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key_value TEXT NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'dev',
  usage INTEGER DEFAULT 0,
  limit_usage BOOLEAN DEFAULT false,
  monthly_limit INTEGER DEFAULT 1000,
  visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own api_keys" ON api_keys
  FOR ALL USING (auth.uid() IS NOT NULL);
```

## 4. Запуск приложения
```bash
npm run dev
```

## 5. Проверка

- Откройте http://localhost:3000/dashboard
- Проверьте статус подключения к Supabase в правом верхнем углу
- Создайте тестовый API ключ
