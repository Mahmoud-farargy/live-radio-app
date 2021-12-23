import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQuery() {
    const { search } = useLocation();
    return useMemo(() => search ? new URLSearchParams(search) : undefined, [search]);
}