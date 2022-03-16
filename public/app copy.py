
from sqlalchemy import create_engine

db_string = 'mssql+pymssql://JashAdmin:DigitalTwinTest@digitaltwintestdb-1.c3cvrv3bs3gl.us-east-2.rds.amazonaws.com:1433/DigTwinEmpTrackin'
db = create_engine(db_string)

with db.connect() as con:

    rs = con.execute('select * FROM UserLogin')

    for row in rs:
        if row[0] == 51.044747:
            print(row[1])
