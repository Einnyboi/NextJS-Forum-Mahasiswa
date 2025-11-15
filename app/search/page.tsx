'use client'; 
import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { categories, popularSearch, fetchResults } from '@/lib/searchdata';

type SearchResult = {
  id: number;
  type: string;
  title: string;
  category: string;
  author: string;
  description: string;
};

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname(); 
  const searchParams = useSearchParams();
  const currentQuery = searchParams?.get('q') ?? null;
  const [inputValue, setInputValue] = useState(currentQuery ?? ''); // State untuk input form
  const [isFocused, setIsFocused] = useState(false);// State untuk melacak fokus input
  const [results, setResults] = useState<SearchResult[]>([]);// State untuk menyimpan hasil pencarian
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentQuery) {

      let cancelled = false;
      setIsLoading(true);
      setResults([]); 

      const run = async () => {
        try {
          const data = await fetchResults(currentQuery);
          if (!cancelled) {
            setResults(data);
          }
        } catch (error) {
          console.error('Failed to fetch results:', error);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

      run();

      return () => {
        cancelled = true;
      };
    } else {
      setResults([]);
      setInputValue(''); 
      setIsLoading(false); 
    }
  }, [currentQuery]); 

  // HANDLER UNTUK FORM
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return; 

    setIsFocused(false); // Sembunyikan suggestions saat submit
  
    router.push(`${pathname}?q=${inputValue}`);
  };

  // Handler untuk input
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  // Handler untuk mengklik suggestion
  const handleSuggestionClick = (searchTerm: string) => {
    setInputValue(searchTerm); 
    setIsFocused(false);
    router.push(`${pathname}?q=${searchTerm}`); 
  };

  const showSuggestions = isFocused && !currentQuery;
  const showResults = !!currentQuery; // Tanda (!!) mengubah string/null menjadi boolean

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>

      {/*FORM PENCARIAN */}
      <form onSubmit={handleSubmit}
        style={{ 
            display: 'flex',
            gap: '5px' 
          }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Searching for something?"
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px' }}
        />
        <button type="submit" 
          style={{ 
            width: '40px', 
            padding: '5px', 
            marginTop: '5px'
          }}
        >
          Search
        </button>
      </form>
      
      {/*BAGIAN SUGGESTIONS */}
      {showSuggestions && (
        <div className="suggestions" style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
          <h3>Popular Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map(category => (
              <li 
                key={category} 
                onClick={() => handleSuggestionClick(category)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {category}
              </li>
            ))}
          </ul>
          <hr />
          <h3>Popular Searches</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {popularSearch.map(term => (
              <li 
                key={term} 
                onClick={() => handleSuggestionClick(term)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* HASIL PENCARIAN*/}
      {showResults && (
        <div className="results" style={{ marginTop: '20px' }}>
          {isLoading ? (
            <p>Searching...</p>
          ) : (
            <>
              <h2>{`Results for: "${currentQuery}"`}</h2>
              {results.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {results.map(content => (
                    <li key={content.id} 
                      style={{ 
                        border: '1px solid #eee', 
                        padding: '10px', 
                        marginBottom: '10px' 
                      }}
                    >
                      <h3>{content.title}</h3>
                      <p>{content.description}</p>
                      <p>{content.author}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No results found.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}