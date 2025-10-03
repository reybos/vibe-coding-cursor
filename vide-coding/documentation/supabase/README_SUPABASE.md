# Интеграция с Supabase

## Настройка

1. **Создайте проект в Supabase:**
   - Перейдите на [supabase.com](https://supabase.com)
   - Создайте новый проект
   - Скопируйте URL проекта и anon key

2. **Настройте переменные окружения:**
   Создайте файл `.env.local` в корне проекта:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Создайте таблицу в Supabase:**
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

## Функциональность

- ✅ Создание API ключей
- ✅ Редактирование API ключей
- ✅ Удаление API ключей
- ✅ Переключение видимости ключей
- ✅ Копирование ключей в буфер обмена
- ✅ Индикатор загрузки
- ✅ Обработка ошибок
- ✅ Хранение в базе данных Supabase

## Структура данных

Каждый API ключ содержит:
- `id` - уникальный идентификатор
- `name` - название ключа
- `key_value` - значение ключа
- `description` - описание (опционально)
- `type` - тип ключа (dev/prod)
- `usage` - количество использований
- `limit_usage` - включен ли лимит
- `monthly_limit` - месячный лимит
- `visible` - видимость ключа
- `created_at` - дата создания
- `updated_at` - дата обновления
