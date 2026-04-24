"use strict";

// Dependencies
const compression = require("compression")
const { parse } = require("smol-toml")
const express = require("express")
const helmet = require("helmet")
const path = require("path")
const fs = require("fs")

// Variables
const config = parse(fs.readFileSync(path.join(__dirname, "config.toml"), "utf8"))
const web = express()
const port = config.web.port

// Configurations
//* Express
web.use(compression())
web.use(helmet({ contentSecurityPolicy: false }))
web.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }))

// Main
web.use("/languages", express.static(path.join(__dirname, "languages")))
web.use("/extra", express.static(path.join(__dirname, "extra")))
web.get("/api/languages", (_, res) => {
    // Variables
    const languagesDir = path.join(__dirname, "languages")
    const extraDir = path.join(__dirname, "extra")
    const langs = fs.readdirSync(languagesDir).filter((f) => f.endsWith(".yaml")).map((f) => "/languages/" + f) || []
    const extra = fs.existsSync(extraDir) ? fs.readdirSync(extraDir).filter((f) => f.endsWith(".yaml")).map((f) => "/extra/" + f) : []
    
    // Main
    res.json({ files: [...langs, ...extra] })
})

web.use("/{*any}", (_, res)=>res.redirect("/"))
web.listen(port, ()=>console.log(`ProLang is running on port ${port}`))