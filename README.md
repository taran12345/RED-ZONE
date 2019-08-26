RED ZONE
Security has become an essential aspect of everyday life in India. One of the way in which we can provide the security is by enabling people with vital inforamtion on the security aspects for the route they would take during the travel from one place to another. “Red Zone” trained the model using multi-class logistic regression, will predict which route is safe for user to travel and also flagged cities as Red(risk), Yellow(moderate safe), Green(safe).


Data Collection
In this model we are using a dummy data scrapped from various third party websites. Later data can be collected through public campaign, public reviews.

Model Training:
Model will be trained using these data collected from various sources using multiclass logistic regression

Parameters considered while training the model:
history of crimes in the area
Murder
Rape
security guards
presence of surveillance cameras

Model Prediction:
Model will predict whether the route on which user is planning to travel is safe or not. For this we will take source and destination as an input from the user.

Model Upgradtion:
Various cities which are flagged as red, yellow, green are regularly updated on the basis of new data(i.e. increase/decrease in criminal activities)
