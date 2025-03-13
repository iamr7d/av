import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, isAfter, isBefore, parseISO, differenceInDays } from 'date-fns';
import {
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineExternalLink,
  HiOutlinePhotograph,
  HiOutlineExclamation,
  HiSparkles,
  HiOfficeBuilding,
  HiChevronDown,
  HiOutlineGlobe,
  HiLocationMarker,
  HiOutlineClock,
  HiAcademicCap,
  HiChartBar,
  HiOutlineCalendar,
  HiOutlineTag
} from 'react-icons/hi';
import MaterialButton from './MaterialButton';
import CalendarPopup from './CalendarPopup';
import { calculateCompatibilityScore } from '../utils/compatibilityScore';

// Static image configuration
const imageConfig = {
  images: {
    default: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    biology: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg',
    chemistry: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg',
    physics: 'https://images.pexels.com/photos/60582/newton-s-cradle-balls-sphere-60582.jpeg',
    math: 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg',
    computerScience: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    engineering: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    medicine: 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg',
    socialScience: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    arts: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg',
    humanities: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg',
    business: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    science: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
  }
};

const extractKeywords = (opportunity) => {
  // Common stop words in PhD listings
  const stopWords = new Set([
    'phd', 'research', 'project', 'study', 'university', 'department',
    'the', 'and', 'or', 'in', 'at', 'of', 'to', 'for', 'with', 'by',
    'funded', 'scholarship', 'position', 'available', 'applications',
    'apply', 'deadline', 'opportunity', 'program', 'student', 'students',
    'work', 'will', 'be', 'is', 'are', 'this', 'that', 'we', 'our', 'us',
    'you', 'your', 'they', 'their', 'them', 'it', 'its', 'have', 'has',
    'had', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'may',
    'might', 'must', 'a', 'an', 'on', 'from'
  ]);

  // Combine all text fields
  const text = [
    opportunity.title,
    opportunity.description,
    opportunity.department,
    opportunity.subjects,
    opportunity.requirements
  ].filter(Boolean).join(' ').toLowerCase();

  // Count word frequency (excluding stop words)
  const words = text.split(/\s+/);
  const wordCount = {};

  for (const word of words) {
    // Clean the word and check if it's valid
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length < 4 || stopWords.has(cleanWord)) continue;
    wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
  }

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
};

const OpportunityImage = ({ opportunity, className }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Determine the category based on opportunity data
    const getCategory = () => {
      const { department, subjects } = opportunity;
      const allTerms = [
        ...(department ? [department.toLowerCase()] : []),
        ...(subjects ? (Array.isArray(subjects) ? subjects : subjects.split(',').map(s => s.trim())).map(s => s.toLowerCase()) : [])
      ];
      
      // Map terms to categories
      for (const term of allTerms) {
        if (!term) continue;
        if (term.includes('bio') || term.includes('life')) return 'biology';
        if (term.includes('chem')) return 'chemistry';
        if (term.includes('phys')) return 'physics';
        if (term.includes('math') || term.includes('stat')) return 'math';
        if (term.includes('comp') || term.includes('software') || term.includes('data')) return 'computerScience';
        if (term.includes('eng') || term.includes('mech') || term.includes('civil')) return 'engineering';
        if (term.includes('med') || term.includes('health') || term.includes('nurs')) return 'medicine';
        if (term.includes('soci') || term.includes('psych') || term.includes('econ')) return 'socialScience';
        if (term.includes('art') || term.includes('music') || term.includes('design')) return 'arts';
        if (term.includes('hist') || term.includes('phil') || term.includes('lang')) return 'humanities';
        if (term.includes('business') || term.includes('finance') || term.includes('market')) return 'business';
      }
      
      return 'science'; // Default to science if no specific match
    };

    try {
      // Get a category-specific image
      const category = getCategory();
      const image = imageConfig.images[category] || imageConfig.images.default;
      setImageUrl(image);
      setLoading(false);
    } catch (err) {
      console.error('Error setting image:', err);
      setImageUrl(imageConfig.images.default);
      setLoading(false);
      setError(true);
    }
  }, [opportunity]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse rounded-lg overflow-hidden`}>
        <div className="flex items-center justify-center h-full">
          <HiOutlinePhotograph className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center`}>
        <HiOutlineExclamation className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden`}>
      <img 
        src={imageUrl} 
        alt={`${opportunity.title} at ${opportunity.university}`}
        className="w-full h-full object-cover"
        onError={() => {
          setError(true);
          setImageUrl(imageConfig.images.default);
        }}
      />
    </div>
  );
};

const OpportunityCard = ({ opportunity, isSaved, onSave, compatibilityScore, onStatusChange, statusOptions }) => {
  const [expanded, setExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const statusDropdownRef = useRef(null);
  const keywords = extractKeywords(opportunity);
  
  // Format deadline with relative time
  const formatDeadline = () => {
    if (!opportunity.deadline) return 'No deadline specified';
    
    try {
      const deadlineDate = parseISO(opportunity.deadline);
      const today = new Date();
      const daysUntil = differenceInDays(deadlineDate, today);
      
      if (daysUntil < 0) {
        return `Deadline passed (${format(deadlineDate, 'MMM d, yyyy')})`;
      } else if (daysUntil === 0) {
        return `Deadline is today (${format(deadlineDate, 'MMM d, yyyy')})`;
      } else if (daysUntil === 1) {
        return `Deadline is tomorrow (${format(deadlineDate, 'MMM d, yyyy')})`;
      } else if (daysUntil < 7) {
        return `Deadline in ${daysUntil} days (${format(deadlineDate, 'MMM d, yyyy')})`;
      } else if (daysUntil < 30) {
        const weeks = Math.floor(daysUntil / 7);
        return `Deadline in ${weeks} week${weeks > 1 ? 's' : ''} (${format(deadlineDate, 'MMM d, yyyy')})`;
      } else {
        return `Deadline: ${format(deadlineDate, 'MMM d, yyyy')}`;
      }
    } catch (error) {
      return `Deadline: ${opportunity.deadline}`;
    }
  };
  
  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Determine if the deadline is approaching (within 14 days)
  const isDeadlineApproaching = () => {
    if (!opportunity.deadline) return false;
    
    try {
      const deadlineDate = parseISO(opportunity.deadline);
      const today = new Date();
      const daysUntil = differenceInDays(deadlineDate, today);
      
      return daysUntil >= 0 && daysUntil <= 14;
    } catch (error) {
      return false;
    }
  };
  
  // Determine if the deadline has passed
  const isDeadlinePassed = () => {
    if (!opportunity.deadline) return false;
    
    try {
      const deadlineDate = parseISO(opportunity.deadline);
      const today = new Date();
      
      return isBefore(deadlineDate, today);
    } catch (error) {
      return false;
    }
  };
  
  // Handle adding to calendar
  const handleAddToCalendar = () => {
    setShowCalendar(true);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Card Header */}
      <div className="relative">
        <OpportunityImage 
          opportunity={opportunity} 
          className="h-32 w-full"
        />
        
        {/* Compatibility score badge */}
        {compatibilityScore !== undefined && (
          <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-md">
            <HiSparkles className="text-yellow-500" />
            <span className="text-gray-800 dark:text-gray-200">{compatibilityScore}% Match</span>
          </div>
        )}
        
        {/* Save button */}
        <button 
          onClick={() => onSave(opportunity.id)}
          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
        >
          {isSaved ? (
            <HiBookmark className="w-5 h-5 text-blue-500" />
          ) : (
            <HiOutlineBookmark className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {opportunity.title}
          </h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <HiOfficeBuilding className="mr-1 flex-shrink-0" />
          <span className="truncate">{opportunity.university}</span>
        </div>
        
        {opportunity.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <HiLocationMarker className="mr-1 flex-shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        )}
        
        {/* Deadline with visual indicator */}
        <div className={`flex items-center text-sm mb-3 ${
          isDeadlinePassed() 
            ? 'text-red-500 dark:text-red-400' 
            : isDeadlineApproaching() 
              ? 'text-orange-500 dark:text-orange-400' 
              : 'text-gray-600 dark:text-gray-400'
        }`}>
          <HiOutlineClock className="mr-1 flex-shrink-0" />
          <span>{formatDeadline()}</span>
        </div>
        
        {/* Tags/Keywords */}
        <div className="flex flex-wrap gap-1 mb-3">
          {keywords.map((keyword, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              <HiOutlineTag className="mr-1" />
              {keyword}
            </span>
          ))}
          
          {opportunity.fullyFunded && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <HiCurrencyDollar className="mr-1" />
              Fully Funded
            </span>
          )}
          
          {opportunity.international && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <HiOutlineGlobe className="mr-1" />
              International
            </span>
          )}
        </div>
        
        {/* Description preview */}
        <p className={`text-sm text-gray-600 dark:text-gray-400 ${expanded ? '' : 'line-clamp-2'} mb-3`}>
          {opportunity.description}
        </p>
        
        {/* Application status dropdown */}
        {statusOptions && (
          <div className="relative mb-3" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <span>{opportunity.status || 'Set application status'}</span>
              <HiChevronDown className={`transition-transform duration-200 ${showStatusDropdown ? 'transform rotate-180' : ''}`} />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      onStatusChange(opportunity.id, status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <MaterialButton
            variant="filled"
            size="small"
            icon={<HiOutlineExternalLink />}
            label="Apply"
            onClick={() => window.open(opportunity.link, '_blank')}
            className="flex-1"
          />
          
          <MaterialButton
            variant="tonal"
            size="small"
            icon={<HiOutlineCalendar />}
            label="Add to Calendar"
            onClick={handleAddToCalendar}
            className="flex-1"
          />
          
          <MaterialButton
            variant="outlined"
            size="small"
            icon={expanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Show less" : "Show more"}
            className="w-10 !px-0 flex-shrink-0"
          />
        </div>
      </div>
      
      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            {/* Department */}
            {opportunity.department && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                  <HiAcademicCap className="mr-1" />
                  Department
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.department}
                </p>
              </div>
            )}
            
            {/* Subjects */}
            {opportunity.subjects && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 flex items-center">
                  <HiChartBar className="mr-1" />
                  Subjects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.subjects}
                </p>
              </div>
            )}
            
            {/* Requirements */}
            {opportunity.requirements && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Requirements
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.requirements}
                </p>
              </div>
            )}
            
            {/* Supervisor */}
            {opportunity.supervisor && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Supervisor
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {opportunity.supervisor}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Calendar popup */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarPopup
            title={opportunity.title}
            description={`Application deadline for ${opportunity.title} at ${opportunity.university}`}
            date={opportunity.deadline ? parseISO(opportunity.deadline) : new Date()}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OpportunityCard;
