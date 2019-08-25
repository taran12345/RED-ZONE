import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
crime =pd.read_csv('01_District_wise_crimes_committed_IPC_2014.csv')
crime['mean_crime']=crime[crime.columns[3:]].mean(axis=1)
def zone(x):
    if (x["mean_crime"] >= 0) & (x["mean_crime"]<100):
        return 0
    elif (x["mean_crime"] >= 100) & (x["mean_crime"]<200):
        return 1
    else:
        return 2

crime = crime.assign(alert_zone=crime.apply(zone, axis=1))

model = LogisticRegression()
X = crime[crime.columns[3:90]]
Y = crime[crime.columns[92]]
model.fit(X,Y)
s = []
while True:
    inp = input()
    if inp == 'exit':
        break
    s.append(crime.loc[crime['District'] == inp]['alert_zone'].values)
    
k= pd.DataFrame(s)
z=np.floor(k.sum(0)/len(k))
print(int(z))
