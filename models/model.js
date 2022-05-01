module.exports = mongoose => {
  var cafeItemSchema = mongoose.Schema(
    {
      item: String,
      price: String,
      section:String
     },
    { timestamps: true }
  );

  cafeItemSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Item = mongoose.model("Item", cafeItemSchema);
  return Item;
};