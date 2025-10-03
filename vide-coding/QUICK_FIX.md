# 🚨 Быстрое исправление ошибки RLS

## Проблема
Ошибка: `new row violates row-level security policy for table "api_keys"`

## ⚡ Быстрое решение

1. **Откройте Supabase Dashboard**
2. **Перейдите в SQL Editor**
3. **Выполните эту команду:**

```sql
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY;
```

4. **Нажмите "Run"**

## ✅ Готово!
Теперь вы можете создавать API ключи без ошибок.

---

## 🔒 Для продакшена (рекомендуется)

Если хотите оставить RLS включенным, создайте политику:

```sql
-- Удалить старую политику
DROP POLICY IF EXISTS "Users can manage their own api_keys" ON api_keys;

-- Создать новую политику
CREATE POLICY "Allow all operations on api_keys" ON api_keys
  FOR ALL USING (true);
```
