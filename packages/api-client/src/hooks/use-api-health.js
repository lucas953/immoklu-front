import { useQuery } from "@tanstack/react-query";
export function useApiHealth() {
    return useQuery({
        queryKey: ["api-health"],
        queryFn: async () => ({ status: "ok" })
    });
}
