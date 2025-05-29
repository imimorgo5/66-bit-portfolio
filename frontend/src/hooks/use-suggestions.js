import { useState, useEffect, useRef } from 'react';

export function useSuggestions({ allItems, filterFn, maxItems = 5}) {
  const [term, setTerm] = useState('');
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {term.length < 2 ? setItems([]) : setItems(allItems.filter(item => filterFn(item, term)).slice(0, maxItems))}, 
    [term, allItems, filterFn, maxItems]);

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setItems([]);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return { term, setTerm, items, containerRef };
}
