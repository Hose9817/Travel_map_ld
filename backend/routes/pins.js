const router = require("express").Router();
const Pin = require("../models/Pin");

//create a new pin

router.post("/", async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//delete pin 

router.delete("/:id", async (req, res) => {
  const pinId = req.params.id;
  try {
    const deletedPin = await Pin.findByIdAndDelete(pinId);
    if (deletedPin) {
      res.status(200).json({ message: "Pin successfull delited" });
    } else {
      res.status(404).json({ message: "Pin not founded!" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error for delite pin: ${error}` });
  }
});

//get all pins

router.get("/", async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

//Add info for pin

// router.put("/:id", async (req, res) => {
//   const pinId = req.params.id;
//   try {
//     const updatedPin = await Pin.findByIdAndUpdate(pinId);
//     console.log('Successfully updated');
//   }
//   catch (err) {
//     console.error(err);
//   }
// })

router.put("/:id", async (req, res) => {
  const pinId = req.params.id;
  const updatedPin = req.body;
  try {
    const existingPin = await Pin.findByIdAndUpdate(pinId, updatedPin, { new: true });
    if (existingPin) {
      res.status(200).json({ message: "Pin updated successfully", pin: existingPin });
    } else {
      res.status(404).json({ message: "Pin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error updating pin: ${error}` });
  }
});

module.exports = router;