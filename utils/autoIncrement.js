const Counter = require("../models/counterModels");

const getNextSequence = async (idPrefix = "userId", prefixString = "STC") => {
  // Find counter with id like 'userId', and increase seq by 1.
  const counter = await Counter.findOneAndUpdate(
    { id: idPrefix },         // filter
    { $inc: { seq: 1 } },     // increment seq
    { new: true, upsert: true } // return updated doc, create if not exists
  );

  // Pad the number to 3 digits (e.g., 7 → 007)
  const padded = String(counter.seq).padStart(3, '0');

  // Return both raw number and formatted string
  return {
    userId: counter.seq,
    customId: `${prefixString}${padded}` // e.g., USR007
  };
};

module.exports = getNextSequence;
