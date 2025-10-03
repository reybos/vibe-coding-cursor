# Исправление ошибки RLS в Supabase

## Проблема
Ошибка `new row violates row-level security policy for table "api_keys"` возникает из-за политики RLS, которая требует аутентифицированного пользователя.

## Решение 1: Отключить RLS (для тестирования)

Выполните в SQL Editor Supabase:

```sql
-- Отключить RLS для таблицы api_keys
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
```

## Решение 2: Создать политику для неаутентифицированных пользователей

```sql
-- Удалить существующую политику
DROP POLICY IF EXISTS "Users can manage their own api_keys" ON api_keys;

-- Создать политику для всех пользователей (включая неаутентифицированных)
CREATE POLICY "Allow all operations on api_keys" ON api_keys
  FOR ALL USING (true);
```

## Решение 3: Настроить аутентификацию (рекомендуется для продакшена)

1. В Supabase Dashboard перейдите в Authentication > Settings
2. Отключите "Enable email confirmations" для тестирования
3. Обновите политику:

```sql
-- Удалить существующую политику
DROP POLICY IF EXISTS "Users can manage their own api_keys" ON api_keys;

-- Создать политику для аутентифицированных пользователей
CREATE POLICY "Authenticated users can manage api_keys" ON api_keys
  FOR ALL USING (auth.role() = 'authenticated');
```

## Проверка
После применения одного из решений попробуйте создать API ключ снова.
