const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour mast have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour mast have less or equal to 40 characters'],
    minlength: [10, 'A tour mast have more or equal to 10 characters']
    // validate: [validator.isAlpha, 'A tour name mast have only characters']
  },
  slug: String,
  secretTour: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    required: [true, 'A tour mast have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour mast have a group size']
  },

  difficulty: {
    type: String,
    required: [true, 'A tour mast have a diffiiculty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty either: easy, medium, difficult'
    }
  },

  price: {
    type: Number,
    required: [true, 'A tour mast have a price']
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'A rating mast be above 1.0'],
    max: [5, 'A rating mast be below 5.0']
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'A price ({VALUE}) should be below the reqular price'
    },
    summery: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour mast have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date]
  }
  // {
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
  // }
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE

//PRE MIDDLEWARE: runs before .save() and .create()

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//POST MIDDLEWARE

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function(next) {
  // tourSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
