import { useQuery } from 'react-query';
import { getFeastInfo, getLentInfo } from 'domain/getDayInfo';

export function fetchDay(key, { date }) {
    return fetch(`${process.env.PUBLIC_URL}/api/day/${date}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .then(res => {
            let day = {};
            if (res) {
                const {
                    comment,
                    prayers,
                    prokimen,
                    aliluja,
                    prichasten,
                    readings,
                    bReadings,
                    saints,
                    seromns,
                    title,
                    glas,
                    week,
                } = res;

                const { colour: feastColour, icon: feastIcon } = getFeastInfo(new Date(date));
                const { fastName, fastingLevelName, colour: lentColour, icon: lentIcon } = getLentInfo(new Date(date));

                day = {
                    comment,
                    fastName,
                    fastingLevelName,
                    prayers,
                    prokimen,
                    aliluja,
                    prichasten,
                    readings,
                    bReadings,
                    saints,
                    seromns,
                    title,
                    glas,
                    week,
                    colour: feastColour || lentColour,
                    icon: feastIcon || lentIcon || 'default.jpg',
                };
            }

            return day;
        });
}

const useDay = date => useQuery(['day', { date }], fetchDay, { retry: false });

export default useDay;
