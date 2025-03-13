import React, { useState, useEffect } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityCardSkeleton from '../components/OpportunityCardSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiExclamation, HiSparkles, HiCurrencyDollar, HiGlobe, HiCalendar, HiAcademicCap, HiFilter, HiX, HiAdjustments, HiSortAscending, HiChevronDown, HiOutlineStar, HiStar } from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaterialButton from '../components/MaterialButton';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useState(() => {
    const saved = localStorage.getItem('savedOpportunities');
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState({
    fullyFunded: false,
    international: false,
    hasDeadline: false,
    hasSupervisor: false,
    subjects: []
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortedScores, setSortedScores] = useState(new Map());
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Application status options
  const statusOptions = [
    'Noted',
    'Started Applying',
    'Applied',
    'Shortlisted',
    'Rejected',
    'Interview',
    'Placed'
  ];

  // Sort dropdown options
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'compatibility', label: 'Best Match' }
  ];

  useEffect(() => {
    // Save opportunities to localStorage whenever they change
    localStorage.setItem('savedOpportunities', JSON.stringify(savedOpportunities));
  }, [savedOpportunities]);

  // Load opportunities on component mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Fetch opportunities data
  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For demonstration purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate realistic opportunity data
      const generatedOpportunities = generateOpportunities();
      setOpportunities(generatedOpportunities);
    } catch (err) {
      setError('Failed to fetch opportunities. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate realistic opportunity data
  const generateOpportunities = () => {
    const universities = [
      'Stanford University',
      'MIT',
      'University of Oxford',
      'ETH Zurich',
      'University of Cambridge',
      'Harvard University',
      'California Institute of Technology',
      'University College London',
      'Imperial College London',
      'University of Toronto'
    ];
    
    const departments = [
      'Computer Science',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Physics',
      'Mathematics',
      'Biology',
      'Chemistry',
      'Environmental Science',
      'Data Science',
      'Biomedical Engineering'
    ];
    
    const titles = [
      'PhD in Machine Learning and Computer Vision',
      'PhD Scholarship in Artificial Intelligence',
      'Doctoral Position in Quantum Computing',
      'PhD Studentship in Robotics',
      'PhD Position in Natural Language Processing',
      'PhD Opportunity in Bioinformatics',
      'Doctoral Research in Sustainable Energy',
      'PhD Fellowship in Cybersecurity',
      'PhD in Human-Computer Interaction',
      'PhD Position in Computational Biology'
    ];
    
    const requirements = [
      "Master's degree in relevant field",
      "Strong programming skills",
      "Background in machine learning",
      "Experience with data analysis",
      "Good communication skills",
      "Publications in relevant conferences",
      "Knowledge of statistical methods",
      "Proficiency in Python/R",
      "Background in mathematics",
      "Research experience"
    ];
    
    // Generate 10 opportunities
    return Array.from({ length: 10 }, (_, i) => {
      const id = `phd-${(i + 1).toString().padStart(3, '0')}`;
      const title = titles[i % titles.length];
      const university = universities[i % universities.length];
      const department = departments[i % departments.length];
      
      // Generate random requirements (3-5 items)
      const numRequirements = 3 + Math.floor(Math.random() * 3);
      const opportunityRequirements = [];
      for (let j = 0; j < numRequirements; j++) {
        const req = requirements[Math.floor(Math.random() * requirements.length)];
        if (!opportunityRequirements.includes(req)) {
          opportunityRequirements.push(req);
        }
      }
      
      // Generate random deadline (1-12 months in the future)
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + 1 + Math.floor(Math.random() * 12));
      
      // Generate random stipend
      const stipendBase = 20000 + Math.floor(Math.random() * 30000);
      const stipend = `$${stipendBase} per year`;
      
      return {
        id,
        title,
        university,
        department,
        description: `Join our research group focused on developing novel approaches in ${title.split(' in ')[1]}. This position offers the opportunity to work with state-of-the-art equipment and collaborate with industry partners.`,
        requirements: opportunityRequirements,
        deadline: deadline.toISOString().split('T')[0],
        location: `${university.split(' ')[0]}, ${Math.random() > 0.5 ? 'USA' : 'UK'}`,
        stipend,
        supervisor: Math.random() > 0.3 ? `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}` : null,
        postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fullyFunded: Math.random() > 0.3,
        international: Math.random() > 0.5,
        applicationLink: 'https://example.com/apply',
        contactEmail: 'admissions@university.edu'
      };
    });
  };

  useEffect(() => {
    const calculateScores = async () => {
      if (!opportunities.length) return;
      
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (!userProfile.sop) return;

      const scores = new Map();
      for (const opp of opportunities) {
        // Use existing score if available, otherwise generate a stable random score
        if (!scores.has(opp.id)) {
          const hash = hashCode(opp.id); // Generate a stable hash from opportunity ID
          const randomScore = 32 + (hash % (92 - 32)); // Use hash to generate a stable score between 32-91
          scores.set(opp.id, randomScore);
        }
      }
      setSortedScores(scores);
    };

    calculateScores();
  }, [opportunities]);

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Sort and filter opportunities
  const getSortedAndFilteredOpportunities = () => {
    let filtered = [...opportunities];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(query) ||
        opp.university.toLowerCase().includes(query) ||
        opp.department.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.fullyFunded) {
      filtered = filtered.filter(opp => opp.fullyFunded);
    }
    if (filters.international) {
      filtered = filtered.filter(opp => opp.international);
    }
    if (filters.hasDeadline) {
      filtered = filtered.filter(opp => opp.deadline && opp.deadline !== 'Deadline Not Specified');
    }
    if (filters.hasSupervisor) {
      filtered = filtered.filter(opp => opp.supervisor);
    }

    // Sort opportunities
    filtered.sort((a, b) => {
      if (sortBy === 'compatibility') {
        // Get compatibility scores from our cached scores
        const scoreA = sortedScores.get(a.id) || 32;
        const scoreB = sortedScores.get(b.id) || 32;
        return scoreB - scoreA; // Sort in descending order
      } else {
        // Sort by date (default)
        const dateA = new Date(a.postedDate || a.deadline || 0);
        const dateB = new Date(b.postedDate || b.deadline || 0);
        return dateB - dateA;
      }
    });

    return filtered;
  };

  // Get sorted and filtered opportunities
  const filteredOpportunities = getSortedAndFilteredOpportunities();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call with the search query
      // For demonstration purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter existing opportunities based on search query
      const query = searchQuery.toLowerCase();
      const results = generateOpportunities().filter(opp => 
        opp.title.toLowerCase().includes(query) ||
        opp.university.toLowerCase().includes(query) ||
        opp.department.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query)
      );
      
      setOpportunities(results);
      
      if (results.length === 0) {
        toast.info('No opportunities found. Try different search terms or filters.');
      } else {
        toast.success(`Found ${results.length} opportunities`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch opportunities. Please try again.');
      toast.error('Error fetching opportunities');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveOpportunity = (opportunity) => {
    const isAlreadySaved = savedOpportunities.some(saved => saved.id === opportunity.id);
    
    if (isAlreadySaved) {
      setSavedOpportunities(savedOpportunities.filter(saved => saved.id !== opportunity.id));
      toast.success(`Removed "${opportunity.title}" from saved opportunities`);
    } else {
      setSavedOpportunities([...savedOpportunities, opportunity]);
      toast.success(`Saved "${opportunity.title}" to your opportunities`);
    }
  };

  const isOpportunitySaved = (opportunityId) => {
    return savedOpportunities.some(saved => saved.id === opportunityId);
  };

  const handleStatusChange = (opportunityId, status) => {
    const updatedSaved = savedOpportunities.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, status };
      }
      return opp;
    });
    
    setSavedOpportunities(updatedSaved);
    toast.success(`Status updated to "${status}"`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">PhD Opportunities</h1>
            <p className="text-text-secondary">Discover and apply for PhD positions worldwide</p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for opportunities by keyword, university, or field..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                  aria-label="Search for opportunities"
                />
                <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
              </div>
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </motion.button>
              <motion.button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <HiFilter className="h-5 w-5" />
                <span>Filters</span>
                {(filters.fullyFunded || filters.international || filters.hasDeadline || filters.hasSupervisor) && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </motion.button>
            </div>
            
            {/* Filter Menu */}
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-slate-900">Filters</h3>
                      <button 
                        onClick={() => setFilters({
                          fullyFunded: false,
                          international: false,
                          hasDeadline: false,
                          hasSupervisor: false,
                          subjects: []
                        })}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Reset all
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <FilterButton
                        active={filters.fullyFunded}
                        onClick={() => toggleFilter('fullyFunded')}
                        icon={<HiCurrencyDollar className="h-5 w-5" />}
                        label="Fully Funded"
                      />
                      <FilterButton
                        active={filters.international}
                        onClick={() => toggleFilter('international')}
                        icon={<HiGlobe className="h-5 w-5" />}
                        label="International Students"
                      />
                      <FilterButton
                        active={filters.hasDeadline}
                        onClick={() => toggleFilter('hasDeadline')}
                        icon={<HiCalendar className="h-5 w-5" />}
                        label="Has Deadline"
                      />
                      <FilterButton
                        active={filters.hasSupervisor}
                        onClick={() => toggleFilter('hasSupervisor')}
                        icon={<HiAcademicCap className="h-5 w-5" />}
                        label="Has Supervisor"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-medium">Sort by:</span>
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {sortOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <HiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5 pointer-events-none" />
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowFilterMenu(false)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Results Section */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-text-primary">
              {loading ? 'Loading opportunities...' : 
                error ? 'Error loading opportunities' : 
                  `${filteredOpportunities.length} Opportunities Found`}
            </h2>
            
            {savedOpportunities.length > 0 && (
              <button 
                onClick={() => {
                  // Toggle between showing all and saved
                  if (opportunities.length === savedOpportunities.length) {
                    fetchOpportunities();
                  } else {
                    setOpportunities(savedOpportunities);
                  }
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <HiOutlineStar className="h-5 w-5" />
                <span>{opportunities.length === savedOpportunities.length ? 'Show All' : 'Show Saved Only'}</span>
              </button>
            )}
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <OpportunityCardSkeleton key={index} />
              ))}
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <HiExclamation className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Opportunities</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchOpportunities}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && filteredOpportunities.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <HiSparkles className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-medium text-blue-800 mb-2">No Opportunities Found</h3>
              <p className="text-blue-600 mb-6">Try adjusting your search terms or filters to find more opportunities.</p>
              <button
                onClick={fetchOpportunities}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
          
          {/* Results Grid */}
          {!loading && !error && filteredOpportunities.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOpportunities.map((opportunity) => (
                <motion.div key={opportunity.id} variants={itemVariants}>
                  <OpportunityCard
                    opportunity={opportunity}
                    isSaved={isOpportunitySaved(opportunity.id)}
                    onSave={() => handleSaveOpportunity(opportunity)}
                    compatibilityScore={sortedScores.get(opportunity.id) || 32}
                    onStatusChange={(status) => handleStatusChange(opportunity.id, status)}
                    statusOptions={statusOptions}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modern Filter Button Component
const FilterButton = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      }`}
    >
      <div className={`${active ? 'text-blue-600' : 'text-slate-500'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {active && (
        <div className="ml-auto">
          <HiX className="h-5 w-5 text-blue-500" />
        </div>
      )}
    </button>
  );
};

export default Opportunities;
