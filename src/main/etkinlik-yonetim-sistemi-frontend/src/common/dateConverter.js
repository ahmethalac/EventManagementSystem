import React from "react"

export default function dateConverter(rawDate) {
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    let temp = new Date(rawDate)
    return temp.getDate() + " " + monthNames[temp.getMonth()] + " " + temp.getFullYear()
}