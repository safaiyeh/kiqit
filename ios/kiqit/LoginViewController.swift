//
//  ViewController.swift
//  kiqit
//
//  Created by Jason Safaiyeh on 7/23/16.
//  Copyright © 2016 Jason Safaiyeh. All rights reserved.
//

import Alamofire
import SwiftyJSON
import UIKit

class LoginViewController: UIViewController {
    
    @IBOutlet var emailTextField: UITextField?
    @IBOutlet var passwordTextField: UITextField?
    @IBOutlet var logInButton: UIButton?
    @IBOutlet var signUpButton: UIButton?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        emailTextField?.becomeFirstResponder()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        if hasLoggedIn() {
            performSegue(withIdentifier: "loginSegue", sender: nil)
        }
    }
    
    func login(_ email: String, password: String) {
        Alamofire.request("https://kiqit.co/api/user/login", method: .post, parameters: ["email": email, "password": password], encoding: JSONEncoding.default)
            .validate(statusCode: 200..<300)
            .responseJSON { response in
                if response.result.isFailure {
                    self.showAlert("Oops!", message: "Looks like you entered invalid login credentials!")
                    return
                }
                
                
                if response.result.isSuccess {
                    self.performSegue(withIdentifier: "loginSegue", sender: nil)
                    self.createLoginFile()
                }
        }
    }
    
    func signUp(_ email: String, password: String) {
        Alamofire.request("https://kiqit.co/api/user", method: .post, parameters: ["email": email, "password": password], encoding: JSONEncoding.default)
            .responseJSON { response in
                if response.response?.statusCode == 409 {
                    let json = JSON(response.result.value)
                    if (json["message"] != nil) {
                        self.showAlert("Oops!", message: JSON(response.result.value!)["message"].string!)
                    } else if (json["email"] != nil) {
                        self.showAlert("Oops!", message: "Email already exists with a user!")
                    } else if (self.passwordTextField?.text == "") {
                        self.showAlert("Oops!", message: "Enter a password for your account.")
                    }
                    return
                }
                
                if response.response?.statusCode == 201 {
                    self.showAlert("Success!", message: "User successfully created.")
                }
        }
    }
    
    func createLoginFile() {
        let file = "login.txt"
        let text = "LOGGED IN"
        
        if let dir = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.allDomainsMask, true).first {
            let path = URL(fileURLWithPath: dir).appendingPathComponent(file)
            do {
                try text.write(to: path, atomically: false, encoding: String.Encoding.utf8)
            } catch {
                /* error handling here */
            }
        }
    }
    
    func hasLoggedIn() -> Bool {
        let paths = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)
        let documentsDirectory: AnyObject = paths[0] as AnyObject
        return FileManager.default.fileExists(atPath: documentsDirectory.appendingPathComponent("login.txt")
)
    }
    
    func validateEmail(_ email: String) -> Bool{
        let emailTrimmed = email.trimmingCharacters(
            in: CharacterSet.whitespaces
        )
        if (String(emailTrimmed.characters.suffix(8)) == "sjsu.edu") {
            return true
        }
        
        return false
    }
    
    func showAlert(_ title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: UIAlertControllerStyle.alert)
        alert.addAction(UIAlertAction(title: "Dismiss", style: UIAlertActionStyle.default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    func resetTextFields() {
        emailTextField!.text = ""
        passwordTextField?.text = ""
    }
    
    @IBAction func logInButtonClick(_ sender: AnyObject) {
        login((emailTextField?.text?.lowercased())!, password: (passwordTextField?.text?.trimmingCharacters(in: CharacterSet.whitespaces))!)
        resetTextFields()
    }
    
    @IBAction func signUpButtonClick(_ sender: AnyObject) {
        if validateEmail((emailTextField?.text?.lowercased())!) {
            signUp((emailTextField?.text?.lowercased())!, password: (passwordTextField?.text?.trimmingCharacters(in: CharacterSet.whitespaces))!)
        } else {
            showAlert("Oops!", message: "You must use a sjsu.edu email to sign up.")
        }
        
        resetTextFields()
    }
}
