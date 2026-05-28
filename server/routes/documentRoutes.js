const express = require("express")
const router = express.Router()

const Document = require("../models/Document")

// CREATE DOCUMENT
router.post("/create", async (req, res) => {

  try {

    const newDoc = await Document.create({
      title: "Untitled Document"
    })

    res.status(201).json(newDoc)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

// GET DOCUMENT
router.get("/:id", async (req, res) => {

  try {

    const document = await Document.findById(req.params.id)

    res.json(document)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})
router.put("/:id", async (req, res) => {

  try {

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
content: req.body.content
      },
      {
        new: true
      }
    )

    res.json(updatedDocument)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

module.exports = router