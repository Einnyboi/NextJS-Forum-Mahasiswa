'use client'; 
import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { categories, popularSearch, fetchResults } from '@/lib/searchdata';
import { Search } from 'lucide-react';

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
    <div
      className="p-4 mx-auto"
      style={{
        maxWidth: '600px',
      }}
    >
      {/*FORM PENCARIAN*/}
      <form 
        onSubmit={handleSubmit} 
        className="mb-3"
      >
        <div className="position-relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Searching for something?"
            className="form-control search-input-no-focus"
            style={{
              padding:'15px',
              borderRadius: '50px', 
              paddingRight: '3rem', 
            }}
          />
          <button
            type="submit"
            title="Search"
            style={{
              position: 'absolute',
              top: '50%',
              right: '15px', 
              transform: 'translateY(-50%)', 
              background: 'none',
              border: 'none',
              color: '#6c757d' 
            }}
          >
            <Search size={25} />
          </button>
        </div>
      </form>

      {/*BAGIAN SUGGESTIONS */}
      {showSuggestions && (
        <div
          className="suggestions border bg-white p-3 ms-4 me-auto" 
          style={{
            maxWidth: '500px',
            marginTop:'-20px'
          }}
        >
          <h3 className="h5">Popular Categories</h3>
          <ul className="list-unstyled p-0"> 
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => handleSuggestionClick(category)}
                className="suggestion-item py-1" 
                style={{ cursor: 'pointer', fontSize: '0.9rem' }} 
              >
                {category}
              </li>
            ))}
          </ul>
          <hr className="my-3" />
          <h3 className="h5">Popular Searches</h3>
          <ul className="list-unstyled p-0"> 
            {popularSearch.map((term) => (
              <li
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="suggestion-item py-1" 
                style={{ cursor: 'pointer', fontSize: '0.9rem' }} 
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* HASIL PENCARIAN*/}
      {showResults && (
        <div
          className="results border bg-white p-3 ms-4 me-auto" 
          style={{
            maxWidth: '500px', 
            marginTop:'-20px'
          }}
        >
          {isLoading ? (
            <p>Searching...</p>
          ) : (
            <>
              <h2 className="h6"> 
                {`Results for: "${currentQuery}"`}
              </h2>
              {results.length > 0 ? (
                <ul className="list-unstyled p-0"> 
                  {results.map((content) => (
                    <li
                      key={content.id}
                      className="item-search p-3 m-2" 
                    >
                      <h3 className="h6">{content.title}</h3> 
                      <p className="mb-1">
                        <small>{content.description}</small>
                      </p>
                      <p className="mb-0">
                        <small>by: {content.author}</small> 
                      </p>
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