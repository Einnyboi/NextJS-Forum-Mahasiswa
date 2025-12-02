'use client'; 
import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { popularSearch } from '@/lib/searchdata'; 
import { api } from '@/lib/api'; 
import { Search } from 'lucide-react';

// Tipe data untuk Hasil Pencarian
type SearchResult = {
  id: number;
  type: string; // Harus 'community' atau 'post' agar pengelompokan berhasil
  title: string;
  category: string;
  author: string;
  description: string;
};

// Tipe data untuk Komunitas/Kategori
type CommunityResult = {
  id: string;
  name: string; 
  description: string;
  imageUrl: string;
};

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname(); 
  const searchParams = useSearchParams();
  const currentQuery = searchParams?.get('q') ?? null;
  
  const [inputValue, setInputValue] = useState(currentQuery ?? ''); 
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // States untuk Kategori (Komunitas)
  const [categoriesList, setCategoriesList] = useState<CommunityResult[]>([]); 
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // FETCHING DATA HASIL PENCARIAN
  useEffect(() => {
    if (currentQuery) {

      let cancelled = false;
      setIsLoading(true);
      setResults([]); 

      const run = async () => {
        try {
          const data: SearchResult[] = await api.search.getResults(currentQuery);
          
          if (!cancelled) {
            setResults(data);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
          setResults([]);
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
  
  //  FETCHING DATA KATEGORI (KOMUNITAS)
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Menggunakan api.communities.getAll()
        const data: CommunityResult[] = await api.communities.getAll();
        setCategoriesList(data);
      } catch (error) {
        console.error("Failed to fetch categories/communities:", error);
        setCategoriesList([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []); 

  // LOGIKA PENGELOMPOKAN HASIL
  const groupedResults = useMemo(() => {
    const communities = results.filter(r => r.type === 'community');
    const posts = results.filter(r => r.type === 'post');
    return { communities, posts };
  }, [results]);

  //  HANDLERS
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return; 
    setIsFocused(false); 
    router.push(`${pathname}?q=${inputValue}`);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  const handleSuggestionClick = (searchTerm: string) => {
    setInputValue(searchTerm); 
    setIsFocused(false);
    router.push(`${pathname}?q=${searchTerm}`); 
  };

  // TAMPILAN
  const showSuggestions = isFocused && !currentQuery;
  const showResults = !!currentQuery; 

  const ResultItem = ({ content }: { content: SearchResult }) => (
      <li key={content.id} className="item-search p-3 m-2 border rounded">
          <h3 className="h6">{content.title}</h3> 
          <p className="mb-1">
              <small>{content.description}</small>
          </p>
          {/* Tampilkan info tambahan hanya untuk Post */}
          {content.type === 'post' && (
              <p className="mb-0 text-success">
                  <small>by: {content.author} | in: {content.category}</small> 
              </p>
          )}
          {/* Tampilkan info tambahan untuk Komunitas */}
          {content.type === 'community' && (
              <p className="mb-0 text-success">
                  <small>Community: {content.category}</small> 
              </p>
          )}
      </li>
  );

  return (
    <div
      className="p-4 mx-auto"
      style={{
        maxWidth: '600px',
      }}
    >
      {/* FORM PENCARIAN */}
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

      {/* BAGIAN SUGGESTIONS */}
      {showSuggestions && (
        <div
          className="suggestions border bg-white p-3 ms-4 me-auto" 
          style={{
            maxWidth: '500px',
            marginTop:'-20px'
          }}
        >
          <h3 className="h5">Popular Categories</h3>
          {isLoadingCategories ? (
            <p className="text-muted">Loading categories...</p>
          ) : (
            <ul className="list-unstyled p-0"> 
              {/* MENGGUNAKAN DATA DARI API: categoriesList */}
              {categoriesList.map((category) => (
                <li
                  key={category.id} 
                  onClick={() => handleSuggestionClick(category.name)}
                  className="suggestion-item py-1" 
                  style={{ cursor: 'pointer', fontSize: '0.9rem' }} 
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
          
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

      {/* HASIL PENCARIAN */}
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
              <h2 className="h6 mb-3 border-bottom pb-2"> 
                {`Results for: "${currentQuery}"`}
              </h2>

              {/* TAMPILAN 1: KOMUNITAS */}
              {groupedResults.communities.length > 0 && (
                <div className="mb-4">
                  <h3 className="h6 text-dark fw-bold">Communities ({groupedResults.communities.length})</h3>
                  <ul className="list-unstyled p-0"> 
                    {groupedResults.communities.map((content) => (
                      <ResultItem key={content.id} content={content} />
                    ))}
                  </ul>
                </div>
              )}

              {/* TAMPILAN 2: POSTINGAN */}
              {groupedResults.posts.length > 0 && (
                <div className="mb-4">
                  <h3 className="h6 text-dark fw-bold">Posts ({groupedResults.posts.length})</h3>
                  <ul className="list-unstyled p-0"> 
                    {groupedResults.posts.map((content) => (
                      <ResultItem key={content.id} content={content} />
                    ))}
                  </ul>
                </div>
              )}

              {/* KONDISI TIDAK ADA HASIL SAMA SEKALI */}
              {(groupedResults.communities.length === 0 && groupedResults.posts.length === 0) && (
                <p>No results found matching your query.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}