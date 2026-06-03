import { useCallback, useMemo, useState } from 'react';

export function useIdempotencyKey(): {
    idempotencyKey: string;
    idempotencyHeaders: Record<string, string>;
    refreshKey: () => void;
} {
    const [key, setKey] = useState(() => crypto.randomUUID());

    const refreshKey = useCallback(() => {
        setKey(crypto.randomUUID());
    }, []);

    const idempotencyHeaders = useMemo(
        () => ({ 'Idempotency-Key': key }),
        [key],
    );

    return { idempotencyKey: key, idempotencyHeaders, refreshKey };
}
