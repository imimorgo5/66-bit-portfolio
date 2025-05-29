import { useState, useEffect } from 'react';
import { PageMode } from '../consts';

export function useFetchDetail({ identifier, pageMode, getPublic, getPrivate, getTeamById }) {
  const [entity, setEntity] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState({ entity: true, team: false });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        let data;
        if (pageMode === PageMode.PUBLIC) {
          data = await getPublic(identifier);
          data = data.project ? data.project : data.card;
        } else {
          data = await getPrivate(identifier);
        }
        if (!mounted) return;
        setEntity(data);

        if (data.teamId) {
          setLoading(prev => ({ ...prev, team: true }));
          const teamData = await getTeamById(data.teamId);
          if (mounted) setTeam(teamData);
        }
      } catch (err) {
        console.error('useFetchDetail:', err);
      } finally {
        if (mounted) setLoading({ entity: false, team: false });
      }
    }

    load();
    return () => { mounted = false; };
  }, [identifier, pageMode, getPublic, getPrivate, getTeamById]);

  return { entity, setEntity, team, loading };
}
