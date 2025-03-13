import mongoose from 'mongoose';

// Define a schema for medical conditions with nested properties
const MedicalConditionSchema = new mongoose.Schema({
  selected: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  }
}, { _id: false }); // _id: false prevents Mongoose from creating IDs for subdocuments

// Define a schema for "other" conditions with details instead of type
const OtherConditionSchema = new mongoose.Schema({
  selected: {
    type: Boolean,
    default: false
  },
  details: {
    type: String,
    default: ''
  }
}, { _id: false });

// Define a schema for allergies with nested properties
const AllergySchema = new mongoose.Schema({
  selected: {
    type: Boolean,
    default: false
  },
  details: {
    type: String,
    default: ''
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  basicInformation: {
    fullName: String,
    age: Number,
    weight: {
      value: Number,
      unit: String
    },
    height: {
      value: Number,
      unit: String
    },
    bloodType: String
  },
  dietaryPreferences: {
    dietType: String,
    dietTypeOther: String,
    allergiesIntolerances: {
      noAllergies: Boolean,
      dairy: Boolean,
      eggs: Boolean,
      nuts: AllergySchema,
      seafoodShellfish: Boolean,
      gluten: Boolean,
      soy: Boolean,
      other: AllergySchema
    },
    favoriteCuisines: {
      italian: Boolean,
      mexican: Boolean,
      indian: Boolean,
      chinese: Boolean,
      japanese: Boolean,
      thai: Boolean,
      mediterranean: Boolean,
      american: Boolean,
      middleEastern: Boolean,
      other: AllergySchema // Reusing AllergySchema as it has the same structure
    },
    spiceTolerance: Number,
    dislikedFoods: String
  },
  medicalConditions: {
    noMedicalConditions: Boolean,
    diabetes: MedicalConditionSchema,
    celiacDisease: Boolean,
    inflammatoryBowelDisease: MedicalConditionSchema,
    hypertension: Boolean,
    cardiovascularDisease: Boolean,
    chronicKidneyDisease: Boolean,
    acidReflux: Boolean,
    irritableBowelSyndrome: Boolean,
    gout: Boolean,
    phenylketonuria: Boolean,
    liverDisease: Boolean,
    other: OtherConditionSchema
  },
  dietaryGoals: {
    weightLoss: Boolean,
    weightGain: Boolean,
    maintenance: Boolean,
    increasedEnergy: Boolean,
    betterDigestion: Boolean,
    improvedSleep: Boolean,
    muscleBuilding: Boolean,
    other: OtherConditionSchema
  },
  lifestyleInformation: {
    type: mongoose.Schema.Types.Mixed
  },
  mealPreferences: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export default mongoose.model('User', UserSchema);