// Erzielte Aggregation:
function getLaenderDaten() {
    var aggr = [{
        "_id": "city",
        "buildings": [{
            "name": "Burkina Faso",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 194,
                    "weight": 112,
                    "age": 21,
                    "country": "Burkina Faso"
                }]
            }],
            "count": 1
        }, {
            "name": "Norfolk Island",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 173,
                    "weight": 53,
                    "age": 33,
                    "country": "Norfolk Island"
                }, {
                    "gender": "Female",
                    "size": 183,
                    "weight": 88,
                    "age": 72,
                    "country": "Norfolk Island"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 161,
                    "weight": 115,
                    "age": 81,
                    "country": "Norfolk Island"
                }]
            }],
            "count": 2
        }, {
            "name": "Cyprus",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 178,
                    "weight": 66,
                    "age": 72,
                    "country": "Cyprus"
                }]
            }],
            "count": 1
        }, {
            "name": "Congo (Brazzaville)",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 207,
                    "weight": 83,
                    "age": 17,
                    "country": "Congo (Brazzaville)"
                }]
            }],
            "count": 1
        }, {
            "name": "Virgin Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 178,
                    "weight": 50,
                    "age": 80,
                    "country": "Virgin Islands"
                }, {
                    "gender": "Female",
                    "size": 205,
                    "weight": 103,
                    "age": 17,
                    "country": "Virgin Islands"
                }, {
                    "gender": "Female",
                    "size": 180,
                    "weight": 75,
                    "age": 42,
                    "country": "Virgin Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Niue",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 161,
                    "weight": 108,
                    "age": 81,
                    "country": "Niue"
                }, {
                    "gender": "Female",
                    "size": 180,
                    "weight": 69,
                    "age": 76,
                    "country": "Niue"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 173,
                    "weight": 69,
                    "age": 68,
                    "country": "Niue"
                }]
            }],
            "count": 2
        }, {
            "name": "Taiwan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 152,
                    "weight": 69,
                    "age": 43,
                    "country": "Taiwan"
                }, {
                    "gender": "Female",
                    "size": 167,
                    "weight": 103,
                    "age": 74,
                    "country": "Taiwan"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 169,
                    "weight": 97,
                    "age": 47,
                    "country": "Taiwan"
                }]
            }],
            "count": 2
        }, {
            "name": "Liberia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 167,
                    "weight": 108,
                    "age": 77,
                    "country": "Liberia"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 164,
                    "weight": 52,
                    "age": 38,
                    "country": "Liberia"
                }]
            }],
            "count": 2
        }, {
            "name": "South Georgia and The South Sandwich Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 209,
                    "weight": 66,
                    "age": 19,
                    "country": "South Georgia and The South Sandwich Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Belgium",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 179,
                    "weight": 70,
                    "age": 60,
                    "country": "Belgium"
                }]
            }],
            "count": 1
        }, {
            "name": "Libya",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 182,
                    "weight": 84,
                    "age": 50,
                    "country": "Libya"
                }]
            }],
            "count": 1
        }, {
            "name": "Ethiopia",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 156,
                    "weight": 57,
                    "age": 74,
                    "country": "Ethiopia"
                }, {
                    "gender": "Male",
                    "size": 202,
                    "weight": 88,
                    "age": 68,
                    "country": "Ethiopia"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 174,
                    "weight": 75,
                    "age": 80,
                    "country": "Ethiopia"
                }]
            }],
            "count": 2
        }, {
            "name": "British Indian Ocean Territory",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 170,
                    "weight": 95,
                    "age": 68,
                    "country": "British Indian Ocean Territory"
                }]
            }],
            "count": 1
        }, {
            "name": "Svalbard and Jan Mayen Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 180,
                    "weight": 78,
                    "age": 20,
                    "country": "Svalbard and Jan Mayen Islands"
                }, {
                    "gender": "Female",
                    "size": 201,
                    "weight": 88,
                    "age": 94,
                    "country": "Svalbard and Jan Mayen Islands"
                }, {
                    "gender": "Female",
                    "size": 162,
                    "weight": 109,
                    "age": 33,
                    "country": "Svalbard and Jan Mayen Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Pitcairn Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 203,
                    "weight": 50,
                    "age": 72,
                    "country": "Pitcairn Islands"
                }, {
                    "gender": "Female",
                    "size": 181,
                    "weight": 114,
                    "age": 49,
                    "country": "Pitcairn Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Congo",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 201,
                    "weight": 91,
                    "age": 34,
                    "country": "Congo"
                }]
            }],
            "count": 1
        }, {
            "name": "Australia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 165,
                    "weight": 82,
                    "age": 22,
                    "country": "Australia"
                }, {
                    "gender": "Female",
                    "size": 193,
                    "weight": 58,
                    "age": 42,
                    "country": "Australia"
                }]
            }],
            "count": 1
        }, {
            "name": "Saint Martin",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 152,
                    "weight": 71,
                    "age": 67,
                    "country": "Saint Martin"
                }]
            }],
            "count": 1
        }, {
            "name": "French Southern Territories",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 192,
                    "weight": 120,
                    "age": 16,
                    "country": "French Southern Territories"
                }]
            }],
            "count": 1
        }, {
            "name": "Chile",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 154,
                    "weight": 72,
                    "age": 89,
                    "country": "Chile"
                }]
            }],
            "count": 1
        }, {
            "name": "Bangladesh",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 205,
                    "weight": 75,
                    "age": 44,
                    "country": "Bangladesh"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 189,
                    "weight": 94,
                    "age": 99,
                    "country": "Bangladesh"
                }]
            }],
            "count": 2
        }, {
            "name": "Greece",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 196,
                    "weight": 68,
                    "age": 17,
                    "country": "Greece"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 185,
                    "weight": 55,
                    "age": 52,
                    "country": "Greece"
                }]
            }],
            "count": 2
        }, {
            "name": "Kyrgyzstan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 181,
                    "weight": 100,
                    "age": 86,
                    "country": "Kyrgyzstan"
                }]
            }],
            "count": 1
        }, {
            "name": "Solomon Islands",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 197,
                    "weight": 119,
                    "age": 82,
                    "country": "Solomon Islands"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 155,
                    "weight": 117,
                    "age": 79,
                    "country": "Solomon Islands"
                }]
            }],
            "count": 2
        }, {
            "name": "Lesotho",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 202,
                    "weight": 117,
                    "age": 64,
                    "country": "Lesotho"
                }]
            }],
            "count": 1
        }, {
            "name": "Belarus",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 179,
                    "weight": 102,
                    "age": 63,
                    "country": "Belarus"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 170,
                    "weight": 90,
                    "age": 96,
                    "country": "Belarus"
                }]
            }],
            "count": 2
        }, {
            "name": "Gambia",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 192,
                    "weight": 118,
                    "age": 52,
                    "country": "Gambia"
                }]
            }],
            "count": 1
        }, {
            "name": "Marshall Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 184,
                    "weight": 104,
                    "age": 38,
                    "country": "Marshall Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Kiribati",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 179,
                    "weight": 85,
                    "age": 43,
                    "country": "Kiribati"
                }]
            }],
            "count": 1
        }, {
            "name": "Dominican Republic",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 208,
                    "weight": 56,
                    "age": 22,
                    "country": "Dominican Republic"
                }]
            }],
            "count": 1
        }, {
            "name": "Ghana",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 199,
                    "weight": 76,
                    "age": 77,
                    "country": "Ghana"
                }, {
                    "gender": "Male",
                    "size": 164,
                    "weight": 95,
                    "age": 23,
                    "country": "Ghana"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 210,
                    "weight": 76,
                    "age": 98,
                    "country": "Ghana"
                }]
            }],
            "count": 2
        }, {
            "name": "Luxembourg",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 180,
                    "weight": 60,
                    "age": 37,
                    "country": "Luxembourg"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 181,
                    "weight": 116,
                    "age": 13,
                    "country": "Luxembourg"
                }]
            }],
            "count": 2
        }, {
            "name": "Georgia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 195,
                    "weight": 104,
                    "age": 98,
                    "country": "Georgia"
                }]
            }],
            "count": 1
        }, {
            "name": "Macedonia",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 166,
                    "weight": 112,
                    "age": 92,
                    "country": "Macedonia"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 193,
                    "weight": 59,
                    "age": 66,
                    "country": "Macedonia"
                }]
            }],
            "count": 2
        }, {
            "name": "Estonia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 163,
                    "weight": 102,
                    "age": 26,
                    "country": "Estonia"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 155,
                    "weight": 58,
                    "age": 48,
                    "country": "Estonia"
                }]
            }],
            "count": 2
        }, {
            "name": "Botswana",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 169,
                    "weight": 113,
                    "age": 25,
                    "country": "Botswana"
                }]
            }],
            "count": 1
        }, {
            "name": "Pakistan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 168,
                    "weight": 113,
                    "age": 17,
                    "country": "Pakistan"
                }]
            }],
            "count": 1
        }, {
            "name": "Holy See (Vatican City State)",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 175,
                    "weight": 70,
                    "age": 89,
                    "country": "Holy See (Vatican City State)"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 151,
                    "weight": 85,
                    "age": 44,
                    "country": "Holy See (Vatican City State)"
                }]
            }],
            "count": 2
        }, {
            "name": "Guinea-Bissau",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 194,
                    "weight": 112,
                    "age": 92,
                    "country": "Guinea-Bissau"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 208,
                    "weight": 118,
                    "age": 88,
                    "country": "Guinea-Bissau"
                }]
            }],
            "count": 2
        }, {
            "name": "Syria",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 150,
                    "weight": 85,
                    "age": 67,
                    "country": "Syria"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 201,
                    "weight": 76,
                    "age": 66,
                    "country": "Syria"
                }, {
                    "gender": "Female",
                    "size": 179,
                    "weight": 89,
                    "age": 50,
                    "country": "Syria"
                }]
            }],
            "count": 2
        }, {
            "name": "Tokelau",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 158,
                    "weight": 77,
                    "age": 37,
                    "country": "Tokelau"
                }]
            }],
            "count": 1
        }, {
            "name": "Palestine",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 163,
                    "weight": 62,
                    "age": 90,
                    "country": "Palestine"
                }]
            }],
            "count": 1
        }, {
            "name": "Peru",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 167,
                    "weight": 110,
                    "age": 28,
                    "country": "Peru"
                }, {
                    "gender": "Female",
                    "size": 202,
                    "weight": 81,
                    "age": 94,
                    "country": "Peru"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 177,
                    "weight": 79,
                    "age": 30,
                    "country": "Peru"
                }]
            }],
            "count": 2
        }, {
            "name": "Ukraine",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 168,
                    "weight": 70,
                    "age": 13,
                    "country": "Ukraine"
                }]
            }],
            "count": 1
        }, {
            "name": "Israel",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 208,
                    "weight": 99,
                    "age": 73,
                    "country": "Israel"
                }]
            }],
            "count": 1
        }, {
            "name": "Kuwait",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 168,
                    "weight": 120,
                    "age": 91,
                    "country": "Kuwait"
                }]
            }],
            "count": 1
        }, {
            "name": "Malta",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 207,
                    "weight": 58,
                    "age": 70,
                    "country": "Malta"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 167,
                    "weight": 65,
                    "age": 72,
                    "country": "Malta"
                }]
            }],
            "count": 2
        }, {
            "name": "Suriname",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 189,
                    "weight": 67,
                    "age": 63,
                    "country": "Suriname"
                }]
            }],
            "count": 1
        }, {
            "name": "Panama",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 197,
                    "weight": 53,
                    "age": 90,
                    "country": "Panama"
                }, {
                    "gender": "Female",
                    "size": 186,
                    "weight": 86,
                    "age": 63,
                    "country": "Panama"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 160,
                    "weight": 81,
                    "age": 19,
                    "country": "Panama"
                }]
            }],
            "count": 2
        }, {
            "name": "Zimbabwe",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 192,
                    "weight": 70,
                    "age": 43,
                    "country": "Zimbabwe"
                }]
            }],
            "count": 1
        }, {
            "name": "Bahamas",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 158,
                    "weight": 54,
                    "age": 42,
                    "country": "Bahamas"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 193,
                    "weight": 117,
                    "age": 93,
                    "country": "Bahamas"
                }, {
                    "gender": "Male",
                    "size": 176,
                    "weight": 79,
                    "age": 15,
                    "country": "Bahamas"
                }]
            }],
            "count": 2
        }, {
            "name": "Angola",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 196,
                    "weight": 64,
                    "age": 25,
                    "country": "Angola"
                }, {
                    "gender": "Male",
                    "size": 170,
                    "weight": 77,
                    "age": 92,
                    "country": "Angola"
                }]
            }],
            "count": 1
        }, {
            "name": "Nepal",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 183,
                    "weight": 98,
                    "age": 20,
                    "country": "Nepal"
                }, {
                    "gender": "Female",
                    "size": 153,
                    "weight": 114,
                    "age": 64,
                    "country": "Nepal"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 188,
                    "weight": 118,
                    "age": 45,
                    "country": "Nepal"
                }]
            }],
            "count": 2
        }, {
            "name": "Uganda",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 187,
                    "weight": 70,
                    "age": 66,
                    "country": "Uganda"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 158,
                    "weight": 118,
                    "age": 53,
                    "country": "Uganda"
                }]
            }],
            "count": 2
        }, {
            "name": "Greenland",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 157,
                    "weight": 115,
                    "age": 67,
                    "country": "Greenland"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 162,
                    "weight": 58,
                    "age": 39,
                    "country": "Greenland"
                }, {
                    "gender": "Female",
                    "size": 168,
                    "weight": 73,
                    "age": 52,
                    "country": "Greenland"
                }]
            }],
            "count": 2
        }, {
            "name": "Tuvalu",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 188,
                    "weight": 88,
                    "age": 98,
                    "country": "Tuvalu"
                }, {
                    "gender": "Female",
                    "size": 187,
                    "weight": 110,
                    "age": 30,
                    "country": "Tuvalu"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 177,
                    "weight": 84,
                    "age": 37,
                    "country": "Tuvalu"
                }, {
                    "gender": "Male",
                    "size": 208,
                    "weight": 59,
                    "age": 77,
                    "country": "Tuvalu"
                }]
            }],
            "count": 2
        }, {
            "name": "Bulgaria",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 181,
                    "weight": 85,
                    "age": 81,
                    "country": "Bulgaria"
                }, {
                    "gender": "Male",
                    "size": 151,
                    "weight": 110,
                    "age": 74,
                    "country": "Bulgaria"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 199,
                    "weight": 89,
                    "age": 30,
                    "country": "Bulgaria"
                }]
            }],
            "count": 2
        }, {
            "name": "Seychelles",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 206,
                    "weight": 84,
                    "age": 21,
                    "country": "Seychelles"
                }, {
                    "gender": "Female",
                    "size": 197,
                    "weight": 90,
                    "age": 47,
                    "country": "Seychelles"
                }]
            }],
            "count": 1
        }, {
            "name": "Bosnia and Herzegovina",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 168,
                    "weight": 54,
                    "age": 68,
                    "country": "Bosnia and Herzegovina"
                }]
            }],
            "count": 1
        }, {
            "name": "Sint Maarten",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 166,
                    "weight": 94,
                    "age": 33,
                    "country": "Sint Maarten"
                }]
            }],
            "count": 1
        }, {
            "name": "Kenya",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 206,
                    "weight": 101,
                    "age": 16,
                    "country": "Kenya"
                }]
            }],
            "count": 1
        }, {
            "name": "Christmas Island",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 166,
                    "weight": 95,
                    "age": 34,
                    "country": "Christmas Island"
                }, {
                    "gender": "Female",
                    "size": 178,
                    "weight": 73,
                    "age": 70,
                    "country": "Christmas Island"
                }]
            }],
            "count": 1
        }, {
            "name": "Switzerland",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 163,
                    "weight": 93,
                    "age": 33,
                    "country": "Switzerland"
                }]
            }],
            "count": 1
        }, {
            "name": "Brazil",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 208,
                    "weight": 85,
                    "age": 45,
                    "country": "Brazil"
                }]
            }],
            "count": 1
        }, {
            "name": "American Samoa",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 151,
                    "weight": 71,
                    "age": 84,
                    "country": "American Samoa"
                }]
            }],
            "count": 1
        }, {
            "name": "Cura�ao",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 163,
                    "weight": 91,
                    "age": 80,
                    "country": "Cura�ao"
                }]
            }],
            "count": 1
        }, {
            "name": "Yemen",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 206,
                    "weight": 71,
                    "age": 62,
                    "country": "Yemen"
                }]
            }],
            "count": 1
        }, {
            "name": "Azerbaijan",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 156,
                    "weight": 58,
                    "age": 98,
                    "country": "Azerbaijan"
                }]
            }],
            "count": 1
        }, {
            "name": "Saint Pierre and Miquelon",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 161,
                    "weight": 85,
                    "age": 79,
                    "country": "Saint Pierre and Miquelon"
                }, {
                    "gender": "Male",
                    "size": 151,
                    "weight": 87,
                    "age": 38,
                    "country": "Saint Pierre and Miquelon"
                }]
            }],
            "count": 1
        }, {
            "name": "Andorra",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 210,
                    "weight": 110,
                    "age": 51,
                    "country": "Andorra"
                }]
            }],
            "count": 1
        }, {
            "name": "New Zealand",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 151,
                    "weight": 86,
                    "age": 58,
                    "country": "New Zealand"
                }, {
                    "gender": "Male",
                    "size": 166,
                    "weight": 95,
                    "age": 25,
                    "country": "New Zealand"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 151,
                    "weight": 84,
                    "age": 28,
                    "country": "New Zealand"
                }]
            }],
            "count": 2
        }, {
            "name": "Senegal",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 169,
                    "weight": 93,
                    "age": 69,
                    "country": "Senegal"
                }, {
                    "gender": "Female",
                    "size": 193,
                    "weight": 54,
                    "age": 92,
                    "country": "Senegal"
                }, {
                    "gender": "Female",
                    "size": 188,
                    "weight": 105,
                    "age": 26,
                    "country": "Senegal"
                }]
            }],
            "count": 1
        }, {
            "name": "Micronesia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 186,
                    "weight": 95,
                    "age": 37,
                    "country": "Micronesia"
                }]
            }],
            "count": 1
        }, {
            "name": "Fiji",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 174,
                    "weight": 56,
                    "age": 51,
                    "country": "Fiji"
                }]
            }],
            "count": 1
        }, {
            "name": "Algeria",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 174,
                    "weight": 88,
                    "age": 81,
                    "country": "Algeria"
                }]
            }],
            "count": 1
        }, {
            "name": "Japan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 181,
                    "weight": 112,
                    "age": 50,
                    "country": "Japan"
                }]
            }],
            "count": 1
        }, {
            "name": "El Salvador",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 202,
                    "weight": 118,
                    "age": 74,
                    "country": "El Salvador"
                }]
            }],
            "count": 1
        }, {
            "name": "Nigeria",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 154,
                    "weight": 92,
                    "age": 62,
                    "country": "Nigeria"
                }]
            }],
            "count": 1
        }, {
            "name": "Reunion",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 184,
                    "weight": 110,
                    "age": 22,
                    "country": "Reunion"
                }, {
                    "gender": "Female",
                    "size": 176,
                    "weight": 113,
                    "age": 37,
                    "country": "Reunion"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 209,
                    "weight": 55,
                    "age": 62,
                    "country": "Reunion"
                }, {
                    "gender": "Male",
                    "size": 199,
                    "weight": 107,
                    "age": 75,
                    "country": "Reunion"
                }, {
                    "gender": "Male",
                    "size": 183,
                    "weight": 111,
                    "age": 38,
                    "country": "Reunion"
                }, {
                    "gender": "Male",
                    "size": 150,
                    "weight": 69,
                    "age": 37,
                    "country": "Reunion"
                }]
            }],
            "count": 2
        }, {
            "name": "Venezuela",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 207,
                    "weight": 97,
                    "age": 91,
                    "country": "Venezuela"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 156,
                    "weight": 106,
                    "age": 82,
                    "country": "Venezuela"
                }]
            }],
            "count": 2
        }, {
            "name": "Ecuador",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 178,
                    "weight": 62,
                    "age": 39,
                    "country": "Ecuador"
                }]
            }],
            "count": 1
        }, {
            "name": "Sudan",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 165,
                    "weight": 50,
                    "age": 59,
                    "country": "Sudan"
                }]
            }],
            "count": 1
        }, {
            "name": "Romania",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 166,
                    "weight": 50,
                    "age": 77,
                    "country": "Romania"
                }]
            }],
            "count": 1
        }, {
            "name": "Sao Tome and Principe",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 208,
                    "weight": 115,
                    "age": 94,
                    "country": "Sao Tome and Principe"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 167,
                    "weight": 65,
                    "age": 77,
                    "country": "Sao Tome and Principe"
                }]
            }],
            "count": 2
        }, {
            "name": "South Sudan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 188,
                    "weight": 56,
                    "age": 15,
                    "country": "South Sudan"
                }, {
                    "gender": "Female",
                    "size": 176,
                    "weight": 57,
                    "age": 67,
                    "country": "South Sudan"
                }]
            }],
            "count": 1
        }, {
            "name": "Ireland",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 186,
                    "weight": 120,
                    "age": 57,
                    "country": "Ireland"
                }, {
                    "gender": "Female",
                    "size": 170,
                    "weight": 57,
                    "age": 46,
                    "country": "Ireland"
                }]
            }],
            "count": 1
        }, {
            "name": "Egypt",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 203,
                    "weight": 91,
                    "age": 26,
                    "country": "Egypt"
                }]
            }],
            "count": 1
        }, {
            "name": "Saint Kitts and Nevis",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 179,
                    "weight": 56,
                    "age": 64,
                    "country": "Saint Kitts and Nevis"
                }, {
                    "gender": "Female",
                    "size": 160,
                    "weight": 59,
                    "age": 16,
                    "country": "Saint Kitts and Nevis"
                }]
            }],
            "count": 1
        }, {
            "name": "Madagascar",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 159,
                    "weight": 87,
                    "age": 23,
                    "country": "Madagascar"
                }]
            }],
            "count": 1
        }, {
            "name": "Dominica",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 151,
                    "weight": 76,
                    "age": 53,
                    "country": "Dominica"
                }, {
                    "gender": "Female",
                    "size": 188,
                    "weight": 52,
                    "age": 32,
                    "country": "Dominica"
                }, {
                    "gender": "Female",
                    "size": 210,
                    "weight": 120,
                    "age": 43,
                    "country": "Dominica"
                }, {
                    "gender": "Female",
                    "size": 210,
                    "weight": 74,
                    "age": 89,
                    "country": "Dominica"
                }, {
                    "gender": "Female",
                    "size": 163,
                    "weight": 54,
                    "age": 82,
                    "country": "Dominica"
                }]
            }],
            "count": 1
        }, {
            "name": "Trinidad and Tobago",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 199,
                    "weight": 89,
                    "age": 99,
                    "country": "Trinidad and Tobago"
                }]
            }],
            "count": 1
        }, {
            "name": "Barbados",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 182,
                    "weight": 100,
                    "age": 86,
                    "country": "Barbados"
                }]
            }],
            "count": 1
        }, {
            "name": "Denmark",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 170,
                    "weight": 93,
                    "age": 61,
                    "country": "Denmark"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 197,
                    "weight": 60,
                    "age": 69,
                    "country": "Denmark"
                }]
            }],
            "count": 2
        }, {
            "name": "Singapore",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 195,
                    "weight": 113,
                    "age": 66,
                    "country": "Singapore"
                }, {
                    "gender": "Female",
                    "size": 154,
                    "weight": 99,
                    "age": 83,
                    "country": "Singapore"
                }, {
                    "gender": "Female",
                    "size": 166,
                    "weight": 79,
                    "age": 61,
                    "country": "Singapore"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 206,
                    "weight": 93,
                    "age": 63,
                    "country": "Singapore"
                }]
            }],
            "count": 2
        }, {
            "name": "Iran",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 180,
                    "weight": 88,
                    "age": 52,
                    "country": "Iran"
                }, {
                    "gender": "Female",
                    "size": 184,
                    "weight": 94,
                    "age": 58,
                    "country": "Iran"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 198,
                    "weight": 115,
                    "age": 28,
                    "country": "Iran"
                }]
            }],
            "count": 2
        }, {
            "name": "Belize",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 171,
                    "weight": 120,
                    "age": 71,
                    "country": "Belize"
                }, {
                    "gender": "Female",
                    "size": 151,
                    "weight": 114,
                    "age": 30,
                    "country": "Belize"
                }]
            }],
            "count": 1
        }, {
            "name": "Bolivia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 161,
                    "weight": 116,
                    "age": 66,
                    "country": "Bolivia"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 189,
                    "weight": 109,
                    "age": 78,
                    "country": "Bolivia"
                }]
            }],
            "count": 2
        }, {
            "name": "Central African Republic",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 156,
                    "weight": 95,
                    "age": 89,
                    "country": "Central African Republic"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 209,
                    "weight": 88,
                    "age": 75,
                    "country": "Central African Republic"
                }, {
                    "gender": "Female",
                    "size": 162,
                    "weight": 64,
                    "age": 95,
                    "country": "Central African Republic"
                }]
            }],
            "count": 2
        }, {
            "name": "Sweden",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 192,
                    "weight": 90,
                    "age": 99,
                    "country": "Sweden"
                }]
            }],
            "count": 1
        }, {
            "name": "Lithuania",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 196,
                    "weight": 109,
                    "age": 90,
                    "country": "Lithuania"
                }]
            }],
            "count": 1
        }, {
            "name": "United States Minor Outlying Islands",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 170,
                    "weight": 119,
                    "age": 60,
                    "country": "United States Minor Outlying Islands"
                }, {
                    "gender": "Female",
                    "size": 201,
                    "weight": 60,
                    "age": 21,
                    "country": "United States Minor Outlying Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "C�te D'Ivoire (Ivory Coast)",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 177,
                    "weight": 54,
                    "age": 85,
                    "country": "C�te D'Ivoire (Ivory Coast)"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 201,
                    "weight": 52,
                    "age": 68,
                    "country": "C�te D'Ivoire (Ivory Coast)"
                }, {
                    "gender": "Male",
                    "size": 181,
                    "weight": 91,
                    "age": 74,
                    "country": "C�te D'Ivoire (Ivory Coast)"
                }, {
                    "gender": "Male",
                    "size": 170,
                    "weight": 107,
                    "age": 60,
                    "country": "C�te D'Ivoire (Ivory Coast)"
                }]
            }],
            "count": 2
        }, {
            "name": "Canada",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 207,
                    "weight": 119,
                    "age": 87,
                    "country": "Canada"
                }]
            }],
            "count": 1
        }, {
            "name": "Djibouti",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 173,
                    "weight": 91,
                    "age": 86,
                    "country": "Djibouti"
                }, {
                    "gender": "Female",
                    "size": 160,
                    "weight": 51,
                    "age": 99,
                    "country": "Djibouti"
                }]
            }],
            "count": 1
        }, {
            "name": "Poland",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 157,
                    "weight": 61,
                    "age": 42,
                    "country": "Poland"
                }, {
                    "gender": "Female",
                    "size": 172,
                    "weight": 100,
                    "age": 35,
                    "country": "Poland"
                }]
            }],
            "count": 1
        }, {
            "name": "Viet Nam",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 166,
                    "weight": 71,
                    "age": 27,
                    "country": "Viet Nam"
                }]
            }],
            "count": 1
        }, {
            "name": "Isle of Man",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 180,
                    "weight": 60,
                    "age": 20,
                    "country": "Isle of Man"
                }]
            }],
            "count": 1
        }, {
            "name": "South Africa",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 202,
                    "weight": 76,
                    "age": 60,
                    "country": "South Africa"
                }, {
                    "gender": "Male",
                    "size": 188,
                    "weight": 115,
                    "age": 14,
                    "country": "South Africa"
                }, {
                    "gender": "Male",
                    "size": 199,
                    "weight": 104,
                    "age": 15,
                    "country": "South Africa"
                }]
            }],
            "count": 1
        }, {
            "name": "Cambodia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 192,
                    "weight": 69,
                    "age": 76,
                    "country": "Cambodia"
                }, {
                    "gender": "Female",
                    "size": 161,
                    "weight": 104,
                    "age": 52,
                    "country": "Cambodia"
                }]
            }],
            "count": 1
        }, {
            "name": "Northern Mariana Islands",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 163,
                    "weight": 63,
                    "age": 70,
                    "country": "Northern Mariana Islands"
                }]
            }],
            "count": 1
        }, {
            "name": "Montserrat",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 184,
                    "weight": 67,
                    "age": 93,
                    "country": "Montserrat"
                }, {
                    "gender": "Female",
                    "size": 166,
                    "weight": 72,
                    "age": 92,
                    "country": "Montserrat"
                }, {
                    "gender": "Female",
                    "size": 153,
                    "weight": 106,
                    "age": 24,
                    "country": "Montserrat"
                }]
            }],
            "count": 1
        }, {
            "name": "Costa Rica",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 151,
                    "weight": 102,
                    "age": 70,
                    "country": "Costa Rica"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 165,
                    "weight": 117,
                    "age": 76,
                    "country": "Costa Rica"
                }, {
                    "gender": "Male",
                    "size": 195,
                    "weight": 56,
                    "age": 65,
                    "country": "Costa Rica"
                }, {
                    "gender": "Male",
                    "size": 170,
                    "weight": 77,
                    "age": 31,
                    "country": "Costa Rica"
                }]
            }],
            "count": 2
        }, {
            "name": "Saint Lucia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 173,
                    "weight": 51,
                    "age": 41,
                    "country": "Saint Lucia"
                }, {
                    "gender": "Female",
                    "size": 178,
                    "weight": 80,
                    "age": 51,
                    "country": "Saint Lucia"
                }]
            }],
            "count": 1
        }, {
            "name": "United Arab Emirates",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 151,
                    "weight": 105,
                    "age": 19,
                    "country": "United Arab Emirates"
                }]
            }],
            "count": 1
        }, {
            "name": "Vanuatu",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 195,
                    "weight": 70,
                    "age": 77,
                    "country": "Vanuatu"
                }, {
                    "gender": "Female",
                    "size": 162,
                    "weight": 88,
                    "age": 44,
                    "country": "Vanuatu"
                }]
            }],
            "count": 1
        }, {
            "name": "Malawi",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 177,
                    "weight": 72,
                    "age": 32,
                    "country": "Malawi"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 187,
                    "weight": 61,
                    "age": 68,
                    "country": "Malawi"
                }, {
                    "gender": "Male",
                    "size": 205,
                    "weight": 118,
                    "age": 13,
                    "country": "Malawi"
                }]
            }],
            "count": 2
        }, {
            "name": "Armenia",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 187,
                    "weight": 120,
                    "age": 24,
                    "country": "Armenia"
                }]
            }],
            "count": 1
        }, {
            "name": "Honduras",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 197,
                    "weight": 72,
                    "age": 42,
                    "country": "Honduras"
                }]
            }],
            "count": 1
        }, {
            "name": "Mozambique",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 175,
                    "weight": 50,
                    "age": 57,
                    "country": "Mozambique"
                }]
            }],
            "count": 1
        }, {
            "name": "Paraguay",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 187,
                    "weight": 116,
                    "age": 49,
                    "country": "Paraguay"
                }]
            }],
            "count": 1
        }, {
            "name": "Western Sahara",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 187,
                    "weight": 64,
                    "age": 30,
                    "country": "Western Sahara"
                }]
            }],
            "count": 1
        }, {
            "name": "Bahrain",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 154,
                    "weight": 91,
                    "age": 85,
                    "country": "Bahrain"
                }, {
                    "gender": "Female",
                    "size": 196,
                    "weight": 107,
                    "age": 92,
                    "country": "Bahrain"
                }]
            }],
            "count": 1
        }, {
            "name": "Monaco",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 161,
                    "weight": 114,
                    "age": 16,
                    "country": "Monaco"
                }]
            }],
            "count": 1
        }, {
            "name": "Portugal",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 173,
                    "weight": 105,
                    "age": 99,
                    "country": "Portugal"
                }]
            }],
            "count": 1
        }, {
            "name": "Niger",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 159,
                    "weight": 94,
                    "age": 69,
                    "country": "Niger"
                }]
            }],
            "count": 1
        }, {
            "name": "Aruba",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 191,
                    "weight": 112,
                    "age": 72,
                    "country": "Aruba"
                }]
            }],
            "count": 1
        }, {
            "name": "Iceland",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 177,
                    "weight": 79,
                    "age": 25,
                    "country": "Iceland"
                }, {
                    "gender": "Female",
                    "size": 151,
                    "weight": 92,
                    "age": 52,
                    "country": "Iceland"
                }, {
                    "gender": "Female",
                    "size": 204,
                    "weight": 79,
                    "age": 94,
                    "country": "Iceland"
                }]
            }],
            "count": 1
        }, {
            "name": "Jersey",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 185,
                    "weight": 88,
                    "age": 48,
                    "country": "Jersey"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 161,
                    "weight": 105,
                    "age": 35,
                    "country": "Jersey"
                }]
            }],
            "count": 2
        }, {
            "name": "Nicaragua",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 189,
                    "weight": 62,
                    "age": 25,
                    "country": "Nicaragua"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 152,
                    "weight": 50,
                    "age": 97,
                    "country": "Nicaragua"
                }]
            }],
            "count": 2
        }, {
            "name": "Hungary",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 204,
                    "weight": 99,
                    "age": 50,
                    "country": "Hungary"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 204,
                    "weight": 120,
                    "age": 98,
                    "country": "Hungary"
                }]
            }],
            "count": 2
        }, {
            "name": "France",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 153,
                    "weight": 72,
                    "age": 87,
                    "country": "France"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 209,
                    "weight": 106,
                    "age": 64,
                    "country": "France"
                }]
            }],
            "count": 2
        }, {
            "name": "Qatar",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 160,
                    "weight": 76,
                    "age": 97,
                    "country": "Qatar"
                }]
            }],
            "count": 1
        }, {
            "name": "Guernsey",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 184,
                    "weight": 107,
                    "age": 74,
                    "country": "Guernsey"
                }]
            }],
            "count": 1
        }, {
            "name": "Benin",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 193,
                    "weight": 77,
                    "age": 18,
                    "country": "Benin"
                }]
            }],
            "count": 1
        }, {
            "name": "Maldives",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 175,
                    "weight": 94,
                    "age": 24,
                    "country": "Maldives"
                }, {
                    "gender": "Female",
                    "size": 161,
                    "weight": 64,
                    "age": 65,
                    "country": "Maldives"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 198,
                    "weight": 79,
                    "age": 36,
                    "country": "Maldives"
                }]
            }],
            "count": 2
        }, {
            "name": "Colombia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 156,
                    "weight": 105,
                    "age": 62,
                    "country": "Colombia"
                }]
            }],
            "count": 1
        }, {
            "name": "India",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 159,
                    "weight": 72,
                    "age": 20,
                    "country": "India"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 171,
                    "weight": 67,
                    "age": 19,
                    "country": "India"
                }, {
                    "gender": "Female",
                    "size": 156,
                    "weight": 118,
                    "age": 45,
                    "country": "India"
                }]
            }],
            "count": 2
        }, {
            "name": "Samoa",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 177,
                    "weight": 117,
                    "age": 15,
                    "country": "Samoa"
                }]
            }],
            "count": 1
        }, {
            "name": "Mongolia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 175,
                    "weight": 109,
                    "age": 39,
                    "country": "Mongolia"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 167,
                    "weight": 54,
                    "age": 63,
                    "country": "Mongolia"
                }]
            }],
            "count": 2
        }, {
            "name": "Namibia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 198,
                    "weight": 73,
                    "age": 64,
                    "country": "Namibia"
                }, {
                    "gender": "Female",
                    "size": 190,
                    "weight": 80,
                    "age": 80,
                    "country": "Namibia"
                }]
            }],
            "count": 1
        }, {
            "name": "United States",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 208,
                    "weight": 105,
                    "age": 91,
                    "country": "United States"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 170,
                    "weight": 115,
                    "age": 46,
                    "country": "United States"
                }]
            }],
            "count": 2
        }, {
            "name": "Austria",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 169,
                    "weight": 60,
                    "age": 67,
                    "country": "Austria"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 191,
                    "weight": 70,
                    "age": 30,
                    "country": "Austria"
                }, {
                    "gender": "Male",
                    "size": 193,
                    "weight": 95,
                    "age": 93,
                    "country": "Austria"
                }]
            }],
            "count": 2
        }, {
            "name": "Mali",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 150,
                    "weight": 118,
                    "age": 29,
                    "country": "Mali"
                }]
            }],
            "count": 1
        }, {
            "name": "Anguilla",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 152,
                    "weight": 106,
                    "age": 87,
                    "country": "Anguilla"
                }, {
                    "gender": "Female",
                    "size": 181,
                    "weight": 105,
                    "age": 27,
                    "country": "Anguilla"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 189,
                    "weight": 117,
                    "age": 59,
                    "country": "Anguilla"
                }, {
                    "gender": "Male",
                    "size": 187,
                    "weight": 60,
                    "age": 18,
                    "country": "Anguilla"
                }]
            }],
            "count": 2
        }, {
            "name": "Serbia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 152,
                    "weight": 111,
                    "age": 64,
                    "country": "Serbia"
                }, {
                    "gender": "Female",
                    "size": 209,
                    "weight": 63,
                    "age": 75,
                    "country": "Serbia"
                }]
            }],
            "count": 1
        }, {
            "name": "Philippines",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 194,
                    "weight": 67,
                    "age": 66,
                    "country": "Philippines"
                }]
            }],
            "count": 1
        }, {
            "name": "Brunei",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 198,
                    "weight": 56,
                    "age": 16,
                    "country": "Brunei"
                }]
            }],
            "count": 1
        }, {
            "name": "Finland",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 160,
                    "weight": 60,
                    "age": 48,
                    "country": "Finland"
                }, {
                    "gender": "Female",
                    "size": 158,
                    "weight": 83,
                    "age": 64,
                    "country": "Finland"
                }, {
                    "gender": "Female",
                    "size": 163,
                    "weight": 113,
                    "age": 90,
                    "country": "Finland"
                }]
            }],
            "count": 1
        }, {
            "name": "Czech Republic",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 180,
                    "weight": 76,
                    "age": 95,
                    "country": "Czech Republic"
                }]
            }],
            "count": 1
        }, {
            "name": "Antigua and Barbuda",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 200,
                    "weight": 59,
                    "age": 83,
                    "country": "Antigua and Barbuda"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 166,
                    "weight": 58,
                    "age": 13,
                    "country": "Antigua and Barbuda"
                }, {
                    "gender": "Female",
                    "size": 168,
                    "weight": 76,
                    "age": 22,
                    "country": "Antigua and Barbuda"
                }]
            }],
            "count": 2
        }, {
            "name": "Gabon",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 183,
                    "weight": 70,
                    "age": 50,
                    "country": "Gabon"
                }, {
                    "gender": "Male",
                    "size": 178,
                    "weight": 89,
                    "age": 90,
                    "country": "Gabon"
                }]
            }],
            "count": 1
        }, {
            "name": "Indonesia",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 173,
                    "weight": 64,
                    "age": 62,
                    "country": "Indonesia"
                }, {
                    "gender": "Female",
                    "size": 167,
                    "weight": 64,
                    "age": 45,
                    "country": "Indonesia"
                }]
            }],
            "count": 1
        }, {
            "name": "Guyana",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 155,
                    "weight": 96,
                    "age": 91,
                    "country": "Guyana"
                }]
            }],
            "count": 1
        }, {
            "name": "Chad",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 160,
                    "weight": 93,
                    "age": 54,
                    "country": "Chad"
                }]
            }],
            "count": 1
        }, {
            "name": "Saint Vincent and The Grenadines",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 157,
                    "weight": 89,
                    "age": 40,
                    "country": "Saint Vincent and The Grenadines"
                }]
            }, {
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 193,
                    "weight": 101,
                    "age": 15,
                    "country": "Saint Vincent and The Grenadines"
                }]
            }],
            "count": 2
        }, {
            "name": "Puerto Rico",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 170,
                    "weight": 51,
                    "age": 37,
                    "country": "Puerto Rico"
                }, {
                    "gender": "Female",
                    "size": 204,
                    "weight": 120,
                    "age": 16,
                    "country": "Puerto Rico"
                }, {
                    "gender": "Female",
                    "size": 190,
                    "weight": 117,
                    "age": 90,
                    "country": "Puerto Rico"
                }]
            }],
            "count": 1
        }, {
            "name": "Togo",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 177,
                    "weight": 106,
                    "age": 92,
                    "country": "Togo"
                }, {
                    "gender": "Female",
                    "size": 168,
                    "weight": 62,
                    "age": 47,
                    "country": "Togo"
                }, {
                    "gender": "Female",
                    "size": 200,
                    "weight": 73,
                    "age": 90,
                    "country": "Togo"
                }]
            }],
            "count": 1
        }, {
            "name": "Montenegro",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 191,
                    "weight": 53,
                    "age": 34,
                    "country": "Montenegro"
                }, {
                    "gender": "Female",
                    "size": 164,
                    "weight": 115,
                    "age": 50,
                    "country": "Montenegro"
                }, {
                    "gender": "Female",
                    "size": 199,
                    "weight": 91,
                    "age": 67,
                    "country": "Montenegro"
                }, {
                    "gender": "Female",
                    "size": 200,
                    "weight": 82,
                    "age": 72,
                    "country": "Montenegro"
                }]
            }],
            "count": 1
        }, {
            "name": "French Guiana",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 182,
                    "weight": 100,
                    "age": 64,
                    "country": "French Guiana"
                }]
            }],
            "count": 1
        }, {
            "name": "Guatemala",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 193,
                    "weight": 77,
                    "age": 98,
                    "country": "Guatemala"
                }, {
                    "gender": "Male",
                    "size": 176,
                    "weight": 90,
                    "age": 98,
                    "country": "Guatemala"
                }]
            }],
            "count": 1
        }, {
            "name": "United Kingdom (Great Britain)",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 166,
                    "weight": 103,
                    "age": 22,
                    "country": "United Kingdom (Great Britain)"
                }]
            }],
            "count": 1
        }, {
            "name": "Russian Federation",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 162,
                    "weight": 114,
                    "age": 52,
                    "country": "Russian Federation"
                }]
            }],
            "count": 1
        }, {
            "name": "Cape Verde",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 196,
                    "weight": 120,
                    "age": 63,
                    "country": "Cape Verde"
                }, {
                    "gender": "Female",
                    "size": 156,
                    "weight": 112,
                    "age": 96,
                    "country": "Cape Verde"
                }]
            }],
            "count": 1
        }, {
            "name": "Korea",
            "buildings": [{
                "name": "Male",
                "buildings": [{
                    "gender": "Male",
                    "size": 166,
                    "weight": 77,
                    "age": 81,
                    "country": "Korea"
                }]
            }, {
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 201,
                    "weight": 79,
                    "age": 22,
                    "country": "Korea"
                }, {
                    "gender": "Female",
                    "size": 198,
                    "weight": 106,
                    "age": 67,
                    "country": "Korea"
                }]
            }],
            "count": 2
        }, {
            "name": "Tajikistan",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 192,
                    "weight": 86,
                    "age": 87,
                    "country": "Tajikistan"
                }]
            }],
            "count": 1
        }, {
            "name": "Wallis and Futuna",
            "buildings": [{
                "name": "Female",
                "buildings": [{
                    "gender": "Female",
                    "size": 150,
                    "weight": 60,
                    "age": 64,
                    "country": "Wallis and Futuna"
                }]
            }],
            "count": 1
        }],
        "count": 166
    }];
    return aggr;
}

function getLaenderZuordnungen() {
    var zuordnungen = {
        "dimensions": {
            "height": "size",
            "width": "weight",
            "color": "age",
            "district": "gender",
            "name": {"name": "country"},
            "area": "weight"
        },
		_id: 0123456789,
		name: "bla",
		collID: 123456,
		districtType : 2
    };
    return zuordnungen;
}
