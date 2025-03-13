/**
 * Search Service - Provides functionality for searching professors and opportunities
 */
import axios from 'axios';

/**
 * Search for professors based on name or research interests
 * @param {string} query - The search query (professor name or research area)
 * @returns {Promise<Array>} - Array of professor data
 */
export const searchProfessors = async (query) => {
  try {
    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate the response with static data
    console.log(`Searching for professor: ${query}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a deterministic "random" score based on the query
    const generateScore = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash % 100);
    };
    
    // Create mock professor data based on the query
    const mockProfessors = [
      {
        id: `prof-${generateScore(query + '1')}`,
        name: query.length > 0 ? `${query.charAt(0).toUpperCase() + query.slice(1)} Smith` : 'John Smith',
        title: 'Professor',
        university: 'Stanford University',
        department: 'Computer Science',
        researchAreas: ['Machine Learning', 'Artificial Intelligence', 'Computer Vision'],
        publications: [
          'Deep Learning for Computer Vision',
          'Advances in Neural Networks',
          'Reinforcement Learning Applications'
        ],
        scholarMetrics: {
          citations: 5000 + generateScore(query),
          hIndex: 30 + (generateScore(query) % 20),
          i10Index: 50 + (generateScore(query) % 30)
        },
        email: `${query.toLowerCase().replace(/[^a-z0-9]/g, '')}@stanford.edu`,
        profileUrl: 'https://cs.stanford.edu/faculty'
      },
      {
        id: `prof-${generateScore(query + '2')}`,
        name: query.length > 0 ? `${query.charAt(0).toUpperCase() + query.slice(1)} Johnson` : 'Sarah Johnson',
        title: 'Associate Professor',
        university: 'MIT',
        department: 'Electrical Engineering and Computer Science',
        researchAreas: ['Natural Language Processing', 'Machine Learning', 'Computational Linguistics'],
        publications: [
          'Transformer Models for NLP',
          'Language Understanding in Context',
          'Semantic Analysis Techniques'
        ],
        scholarMetrics: {
          citations: 3000 + generateScore(query),
          hIndex: 25 + (generateScore(query) % 15),
          i10Index: 40 + (generateScore(query) % 20)
        },
        email: `${query.toLowerCase().replace(/[^a-z0-9]/g, '')}@mit.edu`,
        profileUrl: 'https://eecs.mit.edu/faculty'
      },
      {
        id: `prof-${generateScore(query + '3')}`,
        name: query.length > 0 ? `${query.charAt(0).toUpperCase() + query.slice(1)} Chen` : 'David Chen',
        title: 'Assistant Professor',
        university: 'UC Berkeley',
        department: 'Computer Science',
        researchAreas: ['Robotics', 'Computer Vision', 'Human-Computer Interaction'],
        publications: [
          'Robotic Perception Systems',
          'Vision-based Navigation',
          'Interactive Learning for Robots'
        ],
        scholarMetrics: {
          citations: 1500 + generateScore(query),
          hIndex: 18 + (generateScore(query) % 10),
          i10Index: 25 + (generateScore(query) % 15)
        },
        email: `${query.toLowerCase().replace(/[^a-z0-9]/g, '')}@berkeley.edu`,
        profileUrl: 'https://cs.berkeley.edu/faculty'
      }
    ];
    
    return {
      success: true,
      professors: mockProfessors
    };
  } catch (error) {
    console.error('Error searching for professors:', error);
    return {
      success: false,
      error: error.message || 'Failed to search for professors'
    };
  }
};

/**
 * Search for PhD opportunities based on keywords and filters
 * @param {string} keyword - The search keyword
 * @param {Object} filters - Filters to apply to the search
 * @returns {Promise<Array>} - Array of opportunity data
 */
export const searchOpportunities = async (keyword, filters = {}) => {
  try {
    console.log(`Searching for opportunities with keyword: ${keyword}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a deterministic "random" score based on the keyword
    const generateScore = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash % 100);
    };
    
    // Create mock opportunity data based on the keyword
    const mockOpportunities = [
      {
        id: `opp-${generateScore(keyword + '1')}`,
        title: `PhD in ${keyword || 'Computer Science'} Research`,
        university: 'Stanford University',
        department: 'Computer Science',
        description: `This fully-funded position offers the opportunity to work on cutting-edge ${keyword || 'Computer Science'} research with world-renowned faculty.`,
        requirements: [
          `Master's degree in ${keyword || 'Computer Science'} or related field`,
          'Strong programming skills',
          'Research experience',
          'GRE scores above 320'
        ],
        deadline: '2025-06-15',
        location: 'Stanford, CA, USA',
        stipend: '$40,000 per year',
        duration: '4-5 years',
        fullyFunded: true,
        international: true,
        supervisor: 'Prof. Smith',
        subjects: [keyword || 'Computer Science', 'Machine Learning', 'Artificial Intelligence'],
        postedDate: '2025-02-10'
      },
      {
        id: `opp-${generateScore(keyword + '2')}`,
        title: `PhD Position in ${keyword || 'Physics'} and Computing`,
        university: 'MIT',
        department: 'Physics',
        description: `Join our vibrant research community at the forefront of ${keyword || 'Physics'} and computing research.`,
        requirements: [
          `Master's degree in ${keyword || 'Physics'} or related field`,
          'Strong background in mathematics',
          'Programming experience',
          'GRE subject test recommended'
        ],
        deadline: '2025-05-01',
        location: 'Cambridge, MA, USA',
        stipend: '$42,000 per year',
        duration: '5 years',
        fullyFunded: true,
        international: true,
        supervisor: 'Prof. Johnson',
        subjects: [keyword || 'Physics', 'Quantum Computing', 'Computer Science'],
        postedDate: '2025-01-15'
      },
      {
        id: `opp-${generateScore(keyword + '3')}`,
        title: `PhD Scholarship in ${keyword || 'Data Science'}`,
        university: 'UC Berkeley',
        department: 'School of Information',
        description: `This scholarship supports research in ${keyword || 'Data Science'} with applications in various domains.`,
        requirements: [
          `Master's degree in ${keyword || 'Data Science'}, Computer Science, or Statistics`,
          'Strong analytical skills',
          'Experience with data analysis tools',
          'Excellent communication skills'
        ],
        deadline: '2025-04-30',
        location: 'Berkeley, CA, USA',
        stipend: '$38,000 per year',
        duration: '4 years',
        fullyFunded: false,
        international: false,
        supervisor: 'Prof. Chen',
        subjects: [keyword || 'Data Science', 'Machine Learning', 'Statistics'],
        postedDate: '2025-01-05'
      }
    ];
    
    // Apply filters
    let filteredOpportunities = [...mockOpportunities];
    
    if (filters.fullyFunded) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.fullyFunded);
    }
    
    if (filters.international) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.international);
    }
    
    if (filters.hasDeadline) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.deadline);
    }
    
    if (filters.hasSupervisor) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.supervisor);
    }
    
    // Sort opportunities by deadline
    filteredOpportunities.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      
      return dateA - dateB;
    });
    
    return {
      success: true,
      opportunities: filteredOpportunities
    };
  } catch (error) {
    console.error('Error searching for opportunities:', error);
    return {
      success: false,
      error: error.message || 'Failed to search for opportunities'
    };
  }
};

/**
 * Calculate compatibility score between a student profile and an opportunity
 * @param {Object} opportunity - The opportunity data
 * @param {Object} userProfile - The user's profile data
 * @returns {number} - Compatibility score (0-100)
 */
export const calculateCompatibilityScore = (opportunity, userProfile) => {
  if (!opportunity || !userProfile) return 50; // Default score
  
  // In a real implementation, this would use AI or a sophisticated algorithm
  // For now, we'll use a simple deterministic algorithm
  
  // Generate a stable "random" score based on the opportunity ID and user ID
  const generateScore = (oppId, userId) => {
    const combined = `${oppId}-${userId}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 100);
  };
  
  const baseScore = generateScore(opportunity.id, userProfile.id || 'user123');
  
  // Add some variation based on matching research interests
  let interestBonus = 0;
  if (userProfile.interests && opportunity.subjects) {
    const userInterests = userProfile.interests.map(i => i.toLowerCase());
    const oppSubjects = opportunity.subjects.map(s => s.toLowerCase());
    
    for (const interest of userInterests) {
      for (const subject of oppSubjects) {
        if (subject.includes(interest) || interest.includes(subject)) {
          interestBonus += 5;
        }
      }
    }
  }
  
  // Cap the bonus at 20 points
  interestBonus = Math.min(interestBonus, 20);
  
  // Calculate final score (ensure it's between 0-100)
  const finalScore = Math.min(Math.max(baseScore + interestBonus, 0), 100);
  
  return finalScore;
};

export default {
  searchProfessors,
  searchOpportunities,
  calculateCompatibilityScore
};
