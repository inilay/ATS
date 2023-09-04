import {useMemo} from "react";

export const useSortedTournaments = (tournaments, sort) => {
    const sortedTournaments = useMemo(() => {
        if(sort) {
            return [...tournaments].sort((a, b) => a[sort].localeCompare(b[sort]))
        }
        return tournaments;
    }, [sort, tournaments])

    return sortedTournaments;
}

export const useTournaments = (posts, sort, query) => {
    const sortedTournaments = useSortedTournaments(posts, sort);

    const sortedAndSearchedTournaments = useMemo(() => {
        return sortedTournaments.filter(post => post.title.toLowerCase().includes(query.toLowerCase()))
    }, [query, sortedTournaments])

    return sortedAndSearchedTournaments;
}