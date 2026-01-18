# Инструкция по деплою Base Bird Frame

## 1. Подготовка

Убедитесь, что у вас есть:
- Аккаунт GitHub (проект загружен в репозиторий).
- Аккаунт Vercel.
- URL проекта Supabase и Anon Key.
- Аккаунт Farcaster (для подписи домена).

## 2. Деплой на Vercel

1.  Войдите в [Vercel](https://vercel.com).
2.  Нажмите **Add New...** -> **Project**.
3.  Импортируйте ваш репозиторий GitHub `basebird-frame` (или как вы его назвали).
4.  **Настройка проекта**:
    *   **Framework Preset**: Next.js (должен определиться автоматически).
    *   **Root Directory**: `./` (по умолчанию).
    *   **Environment Variables**: Разверните и добавьте следующие переменные:

| Имя переменной | Описание значения |
| :--- | :--- |
| `NEXT_PUBLIC_URL` | Ваш домен Vercel (например, `https://your-project.vercel.app`). **Важно:** Добавьте это ПОСЛЕ первого деплоя или используйте `https://your-project.vercel.app`, если вы его уже знаете. |
| `NEXT_PUBLIC_ADMIN_WALLET` | Адрес вашего кошелька (админ). |
| `SUPABASE_URL` | URL вашего проекта Supabase. |
| `SUPABASE_ANON_KEY` | Ваш Supabase Anon/Public Key. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | (Опционально) WalletConnect Project ID для Wagmi/RainbowKit, если используется. |

5.  Нажмите **Deploy**.

## 3. Настройка после деплоя (КРИТИЧНО)

Farcaster Frame v2 требует манифест домена с действительной подписью.

1.  **Получите свой домен**: Скопируйте домен Vercel (например, `https://basebird.vercel.app`).
2.  **Подпишите домен**:
    *   Перейдите в [Инструмент верификации доменов Farcaster](https://warpcast.com/~/developers/frames) или используйте скрипт, чтобы подписать строку JSON `{"domain":"basebird.vercel.app"}` своим адресом (custody address) Farcaster.
    *   Вы получите **Signature** (подпись).
3.  **Обновите код**:
    *   Откройте файл `src/app/.well-known/farcaster.json/route.ts`.
    *   Обновите объект `accountAssociation`:
        *   `header`: Заголовок вашего ключа custody (base64).
        *   `payload`: Ваш подписанный payload (base64 от `{"domain":"..."}`).
        *   `signature`: Подпись, которую вы сгенерировали.
4.  **Отправьте изменения**: Сделайте commit и push. Vercel автоматически пересооберет проект.
5.  **Обновите переменную окружения**: убедитесь, что `NEXT_PUBLIC_URL` в настройках Vercel точно совпадает с вашим доменом (без слеша в конце).

## 4. Портал разработчиков Warpcast

1.  Перейдите в [Warpcast Developers](https://warpcast.com/~/developers).
2.  Создайте новое определение Frame (Frame definition).
3.  Установите **Frame URL** на ваш URL Vercel.
4.  Валидатор проверит `/.well-known/farcaster.json`. Если ваша подпись верна, проверка пройдет успешно.

## 5. Устранение неполадок

-   **404 на /.well-known/farcaster.json**: Убедитесь, что файл `route.ts` существует по пути `src/app/.well-known/farcaster.json/` и сборка прошла успешно.
-   **Invalid Signature**: Перепроверьте, что домен в payload точно совпадает с реальным доменом Vercel.
