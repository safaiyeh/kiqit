//
//  Event.swift
//  kiqit
//
//  Created by Jason Safaiyeh on 7/26/16.
//  Copyright © 2016 Jason Safaiyeh. All rights reserved.
//

import Foundation

class Event {
    let title: String
    let description: String
    let location: String
    let startTime: String
    let endTime: String
    
    init(title: String, description: String, location: String, startTime: String, endTime: String) {
        self.title = title
        self.description = description
        self.location = location
        self.startTime = startTime
        self.endTime = endTime
    }
}
