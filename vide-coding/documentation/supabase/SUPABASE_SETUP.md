# Настройка Supabase

## 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте URL проекта и anon key

## 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта с содержимым:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Создание таблицы в Supabase

Выполните следующий SQL в SQL Editor Supabase:

```sql
-- Создание таблицы для API ключей
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

-- Включение RLS (Row Level Security)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Создание политики для аутентифицированных пользователей
CREATE POLICY "Users can manage their own api_keys" ON api_keys
  FOR ALL USING (auth.uid() IS NOT NULL);
```

## 4. Настройка аутентификации (опционально)

Если вы хотите добавить аутентификацию пользователей, настройте Auth в Supabase Dashboard.
