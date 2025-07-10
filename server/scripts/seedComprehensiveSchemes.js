const mongoose = require('mongoose');
require('dotenv').config();

// Define Scheme model similar to the one used in the app
const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    state: { type: String, required: true },
    eligibility: { type: String, required: true },
    link: { type: String },
    launchedBy: { type: String },
    year: { type: Number }
  },
  { timestamps: true }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

// Comprehensive list of agricultural schemes
const comprehensiveSchemes = [
  {
    title: "PM-KISAN",
    description: "₹6000/year direct income support for farmers under DBT.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "All land-holding farmer families",
    link: "https://pmkisan.gov.in/",
    launchedBy: "Govt. of India",
    year: 2019
  },
  {
    title: "Soil Health Card Scheme",
    description: "Helps farmers manage soil nutrients based on soil testing.",
    category: "Extension",
    state: "Pan India",
    eligibility: "All Indian farmers",
    link: "https://soilhealth.dac.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2015
  },
  {
    title: "Kisan Credit Card",
    description: "Provides farmers with timely access to credit.",
    category: "Credit",
    state: "Pan India",
    eligibility: "All eligible farmers",
    link: "https://vikaspedia.in/schemesall/kisan-credit-card",
    launchedBy: "NABARD",
    year: 1998
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme with low premium rates.",
    category: "Insurance",
    state: "Pan India",
    eligibility: "All farmers growing notified crops",
    link: "https://pmfby.gov.in/",
    launchedBy: "Govt. of India",
    year: 2016
  },
  {
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    description: "Incentivizes states to increase public investment in agriculture.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Implemented at state level",
    link: "https://rkvy.nic.in/",
    launchedBy: "Govt. of India",
    year: 2007
  },
  {
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "Promotes organic farming among farmers.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Cluster-based farmers",
    link: "https://vikaspedia.in/agriculture/pkvyojana",
    launchedBy: "Ministry of Agriculture",
    year: 2015
  },
  {
    title: "National Agricultural Market (eNAM)",
    description: "Online trading platform for farmers.",
    category: "Marketing",
    state: "Pan India",
    eligibility: "Registered farmers",
    link: "https://enam.gov.in/",
    launchedBy: "Govt. of India",
    year: 2016
  },
  {
    title: "Micro Irrigation Fund (MIF)",
    description: "Support for farmers to adopt micro-irrigation technologies.",
    category: "Irrigation",
    state: "Pan India",
    eligibility: "Farmers through states",
    link: "https://pmksy.gov.in/mif/",
    launchedBy: "Govt. of India",
    year: 2018
  },
  {
    title: "Weather Based Crop Insurance Scheme (WBCIS)",
    description: "Insurance scheme based on weather parameters.",
    category: "Insurance",
    state: "Pan India",
    eligibility: "All notified farmers",
    link: "https://www.pmfby.gov.in/",
    launchedBy: "Govt. of India",
    year: 2007
  },
  {
    title: "National Mission for Sustainable Agriculture (NMSA)",
    description: "Promotes sustainable agriculture practices.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Small and marginal farmers",
    link: "https://agricoop.nic.in/en/nmsa",
    launchedBy: "Govt. of India",
    year: 2014
  },
  {
    title: "Agricultural Insurance Company of India Ltd (AIC)",
    description: "Provides crop insurance services.",
    category: "Insurance",
    state: "Pan India",
    eligibility: "All eligible farmers",
    link: "https://www.aicofindia.com/",
    launchedBy: "Govt. of India",
    year: 2002
  },
  {
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "Increase irrigated area and improve water use efficiency.",
    category: "Irrigation",
    state: "Pan India",
    eligibility: "Farmers",
    link: "https://pmksy.gov.in/",
    launchedBy: "Govt. of India",
    year: 2015
  },
  {
    title: "Mission for Integrated Development of Horticulture (MIDH)",
    description: "Promotes holistic growth of horticulture sector.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Horticulture farmers",
    link: "https://midh.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2014
  },
  {
    title: "Livestock Insurance Scheme",
    description: "Provides insurance coverage to livestock farmers.",
    category: "Insurance",
    state: "Pan India",
    eligibility: "Livestock owners",
    link: "https://dahd.nic.in/",
    launchedBy: "Ministry of Fisheries, Animal Husbandry & Dairying",
    year: 2005
  },
  {
    title: "National Food Security Mission (NFSM)",
    description: "Increase production of rice, wheat, pulses, coarse cereals.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Farmers growing cereals",
    link: "https://nfsm.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2007
  },
  {
    title: "PM-AASHA",
    description: "Assure remunerative prices to farmers.",
    category: "Marketing",
    state: "Pan India",
    eligibility: "Farmers selling oilseeds and pulses",
    link: "https://vikaspedia.in/pmaasha",
    launchedBy: "Govt. of India",
    year: 2018
  },
  {
    title: "Interest Subvention Scheme",
    description: "Interest subsidy to farmers for short-term crop loans.",
    category: "Credit",
    state: "Pan India",
    eligibility: "Farmers availing KCC",
    link: "https://vikaspedia.in/interest-subvention",
    launchedBy: "Ministry of Agriculture",
    year: 2006
  },
  {
    title: "Agriculture Infrastructure Fund (AIF)",
    description: "Credit facility for post-harvest infrastructure.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "FPOs, cooperatives, agri-entrepreneurs",
    link: "https://agriinfra.dac.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2020
  },
  {
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    description: "Promote farm mechanization among farmers.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Small and marginal farmers",
    link: "https://agricoop.nic.in/en/smam",
    launchedBy: "Govt. of India",
    year: 2014
  },
  {
    title: "Fisheries and Aquaculture Infrastructure Development Fund (FIDF)",
    description: "Boost fisheries sector infrastructure.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "Fish farmers, entrepreneurs",
    link: "https://dof.gov.in/",
    launchedBy: "Ministry of Fisheries",
    year: 2018
  },
  {
    title: "Animal Husbandry Infrastructure Development Fund",
    description: "Support establishment of dairy processing and value addition infrastructure.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "FPOs, Private companies, Individual entrepreneurs",
    link: "https://dahd.nic.in/",
    launchedBy: "Ministry of Fisheries, Animal Husbandry & Dairying",
    year: 2020
  },
  {
    title: "Formation of FPOs",
    description: "Support for 10,000 FPOs to enhance farmers' income through aggregation.",
    category: "Marketing",
    state: "Pan India",
    eligibility: "Small and marginal farmers",
    link: "https://agricoop.nic.in/en/fpo",
    launchedBy: "Govt. of India",
    year: 2020
  },
  {
    title: "Kisan Rail",
    description: "Dedicated freight trains for carrying perishables at affordable cost.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "All farmers and traders",
    link: "https://indianrailways.gov.in/kisan-rail",
    launchedBy: "Ministry of Railways",
    year: 2020
  },
  {
    title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    description: "Sustainable development of fisheries sector in India.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Fishers, fish farmers, entrepreneurs",
    link: "https://pmmsy.dof.gov.in/",
    launchedBy: "Ministry of Fisheries",
    year: 2020
  },
  {
    title: "Maharashtra State Rural Livelihoods Mission",
    description: "Poverty alleviation by implementing sustainable agriculture strategies.",
    category: "Subsidy",
    state: "Maharashtra",
    eligibility: "Rural poor engaged in agriculture",
    link: "https://msrlm.org/",
    launchedBy: "Govt. of Maharashtra",
    year: 2011
  },
  {
    title: "Mukhyamantri Solar Pump Yojana",
    description: "Subsidy for solar pumps for irrigation in Bihar.",
    category: "Irrigation",
    state: "Bihar",
    eligibility: "Farmers in Bihar",
    link: "https://energy.bihar.gov.in/",
    launchedBy: "Govt. of Bihar",
    year: 2018
  },
  {
    title: "Bhavantar Bhugtan Yojana",
    description: "Price deficiency payment scheme for farmers.",
    category: "Marketing",
    state: "Madhya Pradesh",
    eligibility: "Registered farmers in MP",
    link: "https://mpbbyvol.mp.gov.in/",
    launchedBy: "Govt. of Madhya Pradesh",
    year: 2017
  },
  {
    title: "Farm Mechanization Scheme",
    description: "Subsidy on purchase of agricultural implements and machinery.",
    category: "Subsidy",
    state: "Gujarat",
    eligibility: "All farmers of Gujarat",
    link: "https://ikhedut.gujarat.gov.in/",
    launchedBy: "Govt. of Gujarat",
    year: 2016
  },
  {
    title: "Rythu Bandhu",
    description: "Investment support scheme offering ₹5000/acre/season.",
    category: "Subsidy",
    state: "Telangana",
    eligibility: "All farmers owning land",
    link: "https://rythubandhu.telangana.gov.in/",
    launchedBy: "Govt. of Telangana",
    year: 2018
  },
  {
    title: "UP Kisan Karj Mafi Yojana",
    description: "Loan waiver scheme for small and marginal farmers.",
    category: "Credit",
    state: "Uttar Pradesh",
    eligibility: "Marginal farmers with loans",
    link: "https://upkisankarjmafi.gov.in/",
    launchedBy: "Govt. of Uttar Pradesh",
    year: 2017
  },
  {
    title: "Rajasthan Agro-Processing and Agri-Marketing Scheme",
    description: "Promotes value addition and reduces post-harvest losses.",
    category: "Marketing",
    state: "Rajasthan",
    eligibility: "Farmers, entrepreneurs, FPOs",
    link: "https://agriculture.rajasthan.gov.in/",
    launchedBy: "Govt. of Rajasthan",
    year: 2018
  },
  {
    title: "Tamil Nadu Agricultural Mechanisation Program",
    description: "Subsidy on purchase of farm machinery and equipment.",
    category: "Subsidy",
    state: "Tamil Nadu",
    eligibility: "Farmers in Tamil Nadu",
    link: "https://tnagrisnet.tn.gov.in/",
    launchedBy: "Govt. of Tamil Nadu",
    year: 2019
  },
  {
    title: "Karnataka Raitha Suraksha Pradhana Mantri Fasal Bima Yojana",
    description: "State modification of PM crop insurance scheme.",
    category: "Insurance",
    state: "Karnataka",
    eligibility: "All farmers in Karnataka",
    link: "https://raitamitra.karnataka.gov.in/",
    launchedBy: "Govt. of Karnataka",
    year: 2016
  },
  {
    title: "Kerala Group Farming Scheme",
    description: "Promotes collective farming for better economies of scale.",
    category: "Extension",
    state: "Kerala",
    eligibility: "Groups of farmers in Kerala",
    link: "https://keralaagriculture.gov.in/",
    launchedBy: "Govt. of Kerala",
    year: 2018
  },
  {
    title: "Punjab Smart Village Campaign",
    description: "Development of rural infrastructure to support agriculture.",
    category: "Infrastructure",
    state: "Punjab",
    eligibility: "Village panchayats in Punjab",
    link: "https://pbrdp.gov.in/",
    launchedBy: "Govt. of Punjab",
    year: 2019
  },
  {
    title: "Agricultural Technology Management Agency (ATMA)",
    description: "Supports agricultural extension reforms through convergence.",
    category: "Extension",
    state: "Pan India",
    eligibility: "All farmers",
    link: "https://agricoop.nic.in/en/atma",
    launchedBy: "Ministry of Agriculture",
    year: 2005
  },
  {
    title: "Mission Organic Value Chain Development for North Eastern Region",
    description: "Promotes organic farming in Northeast India.",
    category: "Subsidy",
    state: "North Eastern States",
    eligibility: "Farmers in NE states",
    link: "https://agricoop.nic.in/en/movcdner",
    launchedBy: "Ministry of Agriculture",
    year: 2015
  },
  {
    title: "National Bamboo Mission (NBM)",
    description: "Promotes bamboo cultivation and value-added products.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Bamboo cultivators, entrepreneurs",
    link: "https://nbm.nic.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2006
  },
  {
    title: "Yuva Sahakar Cooperative Enterprise Support",
    description: "Funding for innovative cooperative ventures by young professionals.",
    category: "Credit",
    state: "Pan India",
    eligibility: "Young entrepreneurs, cooperatives",
    link: "https://www.ncdc.in/",
    launchedBy: "NCDC",
    year: 2019
  },
  {
    title: "Gramin Bhandaran Yojana",
    description: "Subsidies for construction of rural godowns.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "Farmers, agri-entrepreneurs",
    link: "https://dmi.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2001
  },
  {
    title: "Tribal Sub-Plan for Agriculture",
    description: "Special assistance for tribal farmers.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Tribal farmers",
    link: "https://tribal.nic.in/",
    launchedBy: "Ministry of Tribal Affairs",
    year: 2014
  },
  {
    title: "Attracting and Retaining Youth in Agriculture (ARYA)",
    description: "Enables rural youth to establish agri-enterprises.",
    category: "Extension",
    state: "Pan India",
    eligibility: "Rural youth (18-35 years)",
    link: "https://icar.org.in/arya",
    launchedBy: "Indian Council of Agricultural Research",
    year: 2015
  },
  {
    title: "National Mission on Oilseeds and Oil Palm (NMOOP)",
    description: "Increase production of oilseeds and oil palm.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Oilseed and oil palm farmers",
    link: "https://nmoop.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2014
  },
  {
    title: "National Beekeeping & Honey Mission (NBHM)",
    description: "Promotes beekeeping and production of honey.",
    category: "Subsidy",
    state: "Pan India",
    eligibility: "Beekeepers, entrepreneurs",
    link: "https://nbhm.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2020
  },
  {
    title: "Sub-Mission on Plant Protection and Plant Quarantine",
    description: "Minimize loss to quality and yield of crops from pests.",
    category: "Extension",
    state: "Pan India",
    eligibility: "All farmers",
    link: "http://ppqs.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2014
  },
  {
    title: "Dairy Processing & Infrastructure Development Fund",
    description: "Modernization of dairy processing infrastructure.",
    category: "Infrastructure",
    state: "Pan India",
    eligibility: "Dairy cooperatives, federations",
    link: "https://www.nabard.org/dpidf",
    launchedBy: "NABARD",
    year: 2017
  },
  {
    title: "Krishi Vigyan Kendras (KVKs)",
    description: "Knowledge centers for transferring agricultural technologies.",
    category: "Extension",
    state: "Pan India",
    eligibility: "All farmers",
    link: "https://kvk.icar.gov.in/",
    launchedBy: "Indian Council of Agricultural Research",
    year: 1974
  },
  {
    title: "National Project on Organic Farming",
    description: "Promotes organic farming practices throughout India.",
    category: "Extension",
    state: "Pan India",
    eligibility: "Farmers interested in organic farming",
    link: "https://pgsindia-ncof.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2004
  },
  {
    title: "Agri Clinics and Agri Business Centres",
    description: "Trains agricultural graduates to set up agribusiness ventures.",
    category: "Credit",
    state: "Pan India",
    eligibility: "Agriculture graduates",
    link: "https://acabc.gov.in/",
    launchedBy: "Ministry of Agriculture",
    year: 2002
  },
  {
    title: "Jal Shakti Abhiyan: Catch the Rain",
    description: "Rainwater harvesting initiative to conserve water for agriculture.",
    category: "Irrigation",
    state: "Pan India",
    eligibility: "All farmers, village panchayats",
    link: "https://jaljeevanmission.gov.in/",
    launchedBy: "Govt. of India",
    year: 2021
  }
];

async function seedComprehensiveSchemes() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/krishibandhu1');
    console.log("Connected to MongoDB");

    // Count existing schemes
    const existingCount = await Scheme.countDocuments();
    console.log(`Found ${existingCount} existing schemes in database`);
    
    // Get distinct categories, states, and launchedBy values for statistics
    const distinctCategories = await Scheme.distinct('category');
    const distinctStates = await Scheme.distinct('state');
    
    console.log(`Existing categories: ${distinctCategories.join(', ')}`);
    console.log(`Existing states: ${distinctStates.join(', ')}`);
    
    // First check for duplicates based on title
    const existingTitles = await Scheme.find().distinct('title');
    const newSchemes = comprehensiveSchemes.filter(scheme => 
      !existingTitles.includes(scheme.title)
    );
    
    if (newSchemes.length === 0) {
      console.log("All schemes already exist in the database. No new schemes to add.");
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Adding ${newSchemes.length} new schemes to database...`);
    
    // Insert all new schemes
    const insertResult = await Scheme.insertMany(newSchemes);
    
    // Print success message with statistics
    console.log(`\n✅ Successfully added ${insertResult.length} schemes to database!`);
    console.log(`Total schemes now in database: ${existingCount + insertResult.length}`);
    
    // Show new distinct categories and states after addition
    const newDistinctCategories = await Scheme.distinct('category');
    const newDistinctStates = await Scheme.distinct('state');
    
    console.log(`\nCategory statistics (${newDistinctCategories.length} total categories):`);
    
    // Get count per category
    for (const category of newDistinctCategories) {
      const count = await Scheme.countDocuments({ category });
      console.log(`- ${category}: ${count} schemes`);
    }
    
    console.log(`\nState statistics (${newDistinctStates.length} total states):`);
    // Get count for Pan India vs state-specific
    const panIndiaCount = await Scheme.countDocuments({ state: 'Pan India' });
    console.log(`- Pan India: ${panIndiaCount} schemes`);
    console.log(`- State-specific: ${(existingCount + insertResult.length) - panIndiaCount} schemes`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    
  } catch (error) {
    console.error("Error seeding schemes:", error);
    await mongoose.connection.close();
  }
}

// Run the seeding function
seedComprehensiveSchemes();
