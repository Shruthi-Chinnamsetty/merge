import { useState, useEffect } from 'react';
import axios from 'axios';
import './PhraseFilter.css';

const API_BASE_URL = 'http://localhost:8080/api/phrases';

const LanguagePhrasesComponent = () => {
    const [languages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [phrases, setPhrases] = useState([]);
    const [selectedLanguageId, setSelectedLanguageId] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch languages and categories when component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [languagesRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/languages`),
                    axios.get(`${API_BASE_URL}/categories`)
                ]);
                console.log('Languages:', languagesRes.data); // Debug log
                setLanguages(languagesRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                setError('Failed to load initial data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch phrases when selections change
    useEffect(() => {
        const fetchPhrases = async () => {
            if (!selectedLanguageId) {
                setPhrases([]);
                return;
            }

            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('languageId', selectedLanguageId);
                if (selectedCategoryId) {
                    params.append('categoryId', selectedCategoryId);
                }

                const response = await axios.get(`${API_BASE_URL}/search?${params}`);
                setPhrases(response.data);
            } catch (err) {
                setError('Failed to fetch phrases');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhrases();
    }, [selectedLanguageId, selectedCategoryId]);

    const handleLanguageChange = (e) => {
        setSelectedLanguageId(e.target.value);
        setSelectedCategoryId(''); // Reset category when language changes
    };

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="phrase-filter-container">
            <div className="filter-card">
                <h2>Language Phrase Finder</h2>
                
                <div className="filters">
                    <div className="filter-group">
                        <label htmlFor="language">Language:</label>
                        <select
                            id="language"
                            value={selectedLanguageId}
                            onChange={handleLanguageChange}
                            disabled={loading}
                        >
                            <option value="">Select Language</option>
                            {languages && languages.length > 0 && languages.map((language) => (
                                <option 
                                    key={language.languageId} 
                                    value={language.languageId}
                                >
                                    {/* Match the database column name */}
                                    {language.languageName.charAt(0).toUpperCase() + 
                                     language.languageName.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="category">Category (Optional):</label>
                        <select
                            id="category"
                            value={selectedCategoryId}
                            onChange={handleCategoryChange}
                            disabled={!selectedLanguageId || loading}
                        >
                            <option value="">All Categories</option>
                            {categories && categories.length > 0 && categories.map((category) => (
                                <option 
                                    key={category.categoryId} 
                                    value={category.categoryId}
                                >
                                    {/* Match the database column name */}
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && <div className="loading">Loading...</div>}

                <div className="phrases-list">
                    {phrases.map((phrase) => (
                        <div 
                            key={phrase.phraseId} 
                            className="phrase-card"
                        >
                            <div className="phrase-text">{phrase.phraseText}</div>
                            <div className="phrase-translation">{phrase.translation}</div>
                            <div className="phrase-category">
                                {phrase.category?.categoryName}
                            </div>
                        </div>
                    ))}
                    {!loading && phrases.length === 0 && (
                        <div className="no-phrases">
                            {selectedLanguageId 
                                ? 'No phrases found for the selected filters'
                                : 'Please select a language to see phrases'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LanguagePhrasesComponent;