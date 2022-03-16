from flask import Flask,render_template,session,request, flash, redirect, url_for
from sqlalchemy.orm import Session, registry, scoped_session, declarative_base,sessionmaker
from flask_wtf import FlaskForm
from sqlalchemy.sql.sqltypes import DATE
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired
import requests
from sqlalchemy import Float, create_engine,Column, Integer, String, false
from flask_login import login_user, current_user, logout_user, login_required,UserMixin ,LoginManager
import os
from azure.storage.blob import BlobServiceClient

# function to find all azure container files
def ls_files(client, path, recursive=False):
    '''
    List files under a path, optionally recursively
    '''
    if not path == '' and not path.endswith('/'):
      path += '/'

    blob_iter = client.list_blobs(name_starts_with=path)
    files = []
    for blob in blob_iter:
      relative_path = os.path.relpath(blob.name, path)
      if recursive or not '/' in relative_path:
        files.append(relative_path)
    return files

# My files Images in a list
AllMyFilesImgs = []
try:
    connect_str = os.getenv('DefaultEndpointsProtocol=https;AccountName=hestiatest;AccountKey=aCm6R0ZF4/SYwDYtj6x+8Ss8kolvUw17mq/S4Hao0b0VZJFsUlU7CoJ/BJuTHL/GwG/rdiPPZwdZ+AStbJ8WYA==;EndpointSuffix=core.windows.net')
    blob_service_client = BlobServiceClient.from_connection_string('DefaultEndpointsProtocol=https;AccountName=hestiatest;AccountKey=aCm6R0ZF4/SYwDYtj6x+8Ss8kolvUw17mq/S4Hao0b0VZJFsUlU7CoJ/BJuTHL/GwG/rdiPPZwdZ+AStbJ8WYA==;EndpointSuffix=core.windows.net')

    containers = blob_service_client.list_containers('project-1')
    for c in containers:
        client = blob_service_client.get_container_client(c.name)
        files = ls_files(client, '', recursive=True)
        # ALL FILES IN THE CONTAINER ! (INCLUDING MAIN DIRECTORY)
        for f in files:
            try:
                imgName = f.split('\\')[1]
                AllMyFilesImgs.append(imgName)
                
            except:
                'skip'
        # NAME OF ALL THE CONTAINERS (PROJECT NAMES) I.E., EACH PROJECT WILL NEED ITS OWN CONTAINER
        print(c.name)


except Exception as ex:
    print('Exception:')
    print(ex)


db_string = 'mssql+pymssql://JashAdmin:DigitalTwinTest@digitaltwintestdb-1.c3cvrv3bs3gl.us-east-2.rds.amazonaws.com:1433/DigTwinEmpTrackin'
dbs = create_engine(db_string)
mapper_registry = registry()
Base = mapper_registry.generate_base()
mapper_registry.metadata.create_all(dbs)
Session = sessionmaker(autocommit=False, autoflush=False, bind=dbs)
session = scoped_session(Session)
Base = declarative_base()
Base.query = session.query_property()


class User(Base, UserMixin):
    __tablename__ = "LoginInfo"

    id = Column(Integer, primary_key=True)
    email = Column(String(255),unique=True, nullable=False)
    Passwords= Column(String(255), nullable=False)
    Username =Column(String(255))
    Auth=Column(String(255))

    def __repr__(self):
        return f"User('{self.Username}', '{self.email}', '{self.Auth}')"
    def get_id(self):
        # returns the user e-mail. not sure who calls this
        return self.id
    def is_authenticated(self):
        return self.authenticated
    #constructor
    def __init__(self, name=None, email=None, password=None):
        self.Username = name
        self.email = email
        self.Passwords = password
        self.authenticated = True
    def get_Auth(self):
        return int(self.Auth)



class Projects(Base):
    __tablename__ = "ProjInfo"

    ProjId = Column(Integer, primary_key=True)
    ProjName = Column(String(255),unique=True, nullable=False)
    URN = Column(String(255), nullable=False)
    ProjImg = Column(String(255), nullable=False)
    Descr = Column(String(2000))
    UpdatedDate = Column(DATE)
    EnscpRen = Column(String(255))
    PBI = Column(String(1000))
    PercentComp = Column(Integer)
    ProjContainer = Column(String(255))

    def __repr__(self):
        return f"Projects('{self.ProjName}', '{self.URN}', '{self.Descr}','{self.EnscpRen}','{self.PBI}','{self.PercentComp}')"
    #constructor
    def __init__(self, ProjName=None, URN=None, Descr=None,EnscpRen=None,PBI = None,PercentComp = None):
        self.ProjName = ProjName
        self.URN = URN
        self.Descr = Descr
        self.EnscpRen = EnscpRen
        self.PBI = PBI
        self.PercentComp = PercentComp
        
class Access(Base):
    __tablename__ = "ProjAccess"
    id = Column(Integer, primary_key=True)
    ProjName = Column(String(255), nullable=False)
    UserEmail = Column(String(255), nullable=False)

    def __repr__(self):
        return f"Access('{self.ProjName}', '{self.UserEmail}')"
    #constructor
    def __init__(self, ProjName=None, UserEmail=None):
        self.ProjName = ProjName
        self.UserEmail= UserEmail

class OvrlySheets(Base):
    __tablename__ = "OvrlyShtInfo"

    ShtKey = Column(Integer, primary_key=True)
    ProjName = Column(String(255),unique=True, nullable=False)
    ShtId = Column(Float, nullable=False)
    Scale = Column(Float, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    z = Column(Float, nullable=False)
    URN = Column(String(255), nullable=False)


    def __repr__(self):
        return f"OvrlySheets('{self.ProjName}', '{self.ShtId}', '{self.Scale}','{self.x}','{self.y}','{self.z}','{self.URN}')"
    #constructor
    def __init__(self, ProjName=None, ShtId=None, Scale=None,x=None,y = None,z = None,URN = None):
        self.ProjName = ProjName
        self.ShtId = ShtId
        self.Scale = Scale
        self.x = x
        self.y = y
        self.z = z
        self.URN = URN

class ProjTeam(Base):
    __tablename__ = "ProjTeamInfo"

    Id = Column(Integer, primary_key=True)
    MemName = Column(String(255), nullable=False)
    JobTitle = Column(String(255), nullable=False)
    Quote = Column(String(255))
    Descr = Column(String(255))
    ProfilePic = Column(String(255), nullable=False)
    UserEmail = Column(String(255), nullable=False)

    def __repr__(self):
        return f"ProjTeam( '{self.MemName}','{self.JobTitle}','{self.Quote}','{self.Descr}','{self.ProfilePic}','{self.UserEmail}')"
    #constructor
    def __init__(self, MemName=None,JobTitle=None,Quote = None,Descr = None,ProfilePic= None,UserEmail= None):
        self.MemName = MemName
        self.JobTitle = JobTitle
        self.Quote = Quote
        self.Descr = Descr
        self.ProfilePic = ProfilePic
        self.UserEmail = UserEmail

class ProjTeamMatrix(Base):
    __tablename__ = "ProjTeamInfoMatrix"

    Id = Column(Integer, primary_key=True)
    ProjName = Column(String(255), nullable=False)
    HeirarchyInd = Column(Integer, nullable=False)
    UserEmail = Column(String(255), nullable=False)

    def __repr__(self):
        return f"ProjTeam( '{self.ProjName}','{self.HeirarchyInd}','{self.UserEmail }')"
    #constructor
    def __init__(self, ProjName=None,HeirarchyInd=None,UserEmail  = None):
        self.ProjName = ProjName
        self.HeirarchyInd = HeirarchyInd
        self.UserEmail  = UserEmail 

class Sprites360Ren(Base):
    __tablename__ = "Sprites_Ren360"
    Id = Column(Integer, primary_key=True)
    ProjName = Column(String(255), nullable=False)
    SpriteID = Column(Integer, nullable=False)
    Title = Column(String(255), nullable=False)
    SpritePosX = Column(Float,nullable=False)
    SpritePosY = Column(Float,nullable=False)
    SpritePosZ = Column(Float,nullable=False)
    CamTargetX = Column(Float,nullable=False)
    CamTargetY = Column(Float,nullable=False)
    CamTargetZ = Column(Float,nullable=False)
    RenURL = Column(String(510), nullable=False)

    def __repr__(self):
        return f"Projects('{self.ProjName}', '{self.SpriteID}', '{self.Title}','{self.SpritePosX}','{self.SpritePosY}','{self.SpritePosZ}','{self.CamTargetX}','{self.CamTargetY}','{self.CamTargetZ}','{self.RenURL}')"
    #constructor
    def __init__(self, ProjName=None, SpriteID=None, Title=None,SpritePosX = None,SpritePosY = None,SpritePosZ = None,CamTargetX=None,CamTargetY=None,CamTargetZ=None,RenURL = None):
        self.ProjName = ProjName
        self.SpriteID = SpriteID
        self.Title = Title
        self.SpritePosX = SpritePosX
        self.SpritePosY = SpritePosY
        self.SpritePosZ = SpritePosZ
        self.CamTargetX= CamTargetX
        self.CamTargetY= CamTargetY
        self.CamTargetZ= CamTargetZ
        self.RenURL = RenURL


class DesOpts(Base):
    __tablename__ = "DesOptions"
    Id = Column(Integer, primary_key=True)
    ProjName = Column(String(255), nullable=False)
    DesOptImgSrc = Column(String(1000), nullable=False)
    DesOptDesc = Column(String(2000))
    PostedDate = Column(DATE)
    DesOptTitle = Column(String(255))
    MainTitle = Column(String(255))

    def __repr__(self):
        return f"Projects('{self.ProjName}', '{self.DesOptImgSrc}', '{self.DesOptDesc}','{self.PostedDate}','{self.DesOptTitle}','{self.MainTitle}')"
    #constructor
    def __init__(self, ProjName=None, DesOptImgSrc=None, DesOptDesc=None,PostedDate=None,DesOptTitle = None,MainTitle = None):
        self.ProjName = ProjName
        self.DesOptImgSrc = DesOptImgSrc
        self.DesOptDesc = DesOptDesc
        self.PostedDate = PostedDate
        self.DesOptTitle = DesOptTitle
        self.MainTitle = MainTitle


url = "https://developer.api.autodesk.com/authentication/v1/authenticate"

payload='client_id=oAdjM9mzbZzGei0yvegQdytZ9sadIMhy&client_secret=0uJBb84HA2wYHm4e&grant_type=client_credentials&scope=account%3Awrite%20account%3Aread%20data%3Awrite%20data%3Acreate%20data%3Aread%20bucket%3Aread%20bucket%3Acreate%20code%3Aall'
headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'PF=cmJ8lIFdaCGpw8kwJRvfwV'
}

response = requests.request("POST", url, headers=headers, data=payload)

Everything = response.json()
data = str(Everything.get('access_token'))
# print(data)


class LoginForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

app = Flask(__name__)
app.secret_key = "qwerty"
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route('/auth', methods=['GET', 'POST'])
def testfn():
    # GET request
    if request.method == 'GET':
        url = "https://developer.api.autodesk.com/authentication/v1/authenticate"

        payload='client_id=oAdjM9mzbZzGei0yvegQdytZ9sadIMhy&client_secret=0uJBb84HA2wYHm4e&grant_type=client_credentials&scope=account%3Aread%20data%3Aread%20bucket%3Aread%20code%3Aall'
        headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PF=cmJ8lIFdaCGpw8kwJRvfwV'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        Everything = response.json()
        data = str(Everything.get('access_token'))
    
        return Everything # serialize and use JSON headers


@app.route("/viewer")
def viewer():
    CurrProjURN = request.args.get('urn')
    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        rs = session.query(OvrlySheets)
        for r in rPI:
            CurrProjName = r.ProjName
        rs360 = session.query(Sprites360Ren).filter(Sprites360Ren.ProjName==CurrProjName)
        OvrlyShtDict = {}
        rs360DictByID = {}
        for r in rs360:
            try:
                rs360DictByID[r.SpriteID].append([r.Title,r.SpritePosX,r.SpritePosY,r.SpritePosZ,r.CamTargetX,r.CamTargetY,r.CamTargetZ,r.RenURL])
            except:
                rs360DictByID[r.SpriteID] =  [[r.Title,r.SpritePosX,r.SpritePosY,r.SpritePosZ,r.CamTargetX,r.CamTargetY,r.CamTargetZ,r.RenURL]]
        
        for p in rs:
            NewUrn = p.URN.replace(":", "_")
            try:
                OvrlyShtDict[str(NewUrn)].append([p.ShtId,p.Scale,p.x,p.y,p.z])
            except:
                OvrlyShtDict[str(NewUrn)] = [[p.ShtId,p.Scale,p.x,p.y,p.z]]

    return render_template('ForgeViewer.html', title='ForgeViewer', data = data,OvrlyShtDict=OvrlyShtDict,rs360DictByID=rs360DictByID)

@app.route("/Enscape")
def Enscape():
    return render_template('EnscapeRenderer.html', title='Enscape Render')

@app.route("/Stats")
def Stats():
    return render_template('PowerBIStats.html', title='ProjectStatsDashboard')

@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        with Session() as session:
            rv= session.query(User)
            UserDict={}
            for i in rv:
                UserDict[i.email]=i.Passwords
            if form.email.data in UserDict:

                for i in rv: 
                    if i.email == form.email.data and i.Passwords == form.password.data:
                        login_user(i,remember=form.remember.data)
                        flash('You have been logged in!', 'success')
                        return redirect(url_for('home'))
                    elif UserDict[form.email.data] != form.password.data:
                        flash('Login Unsuccessful. Please check username and password', 'danger')
            else:
                flash('Login Unsuccessful. Email Does not Exist in Database', 'danger')

    return render_template('Login.html', title='Login', form=form)



@app.route("/MyProjects")
@login_required
def MyProjects():
    ProjList=[]
    with Session() as session:
        rp= session.query(User).filter(User.email==current_user.email)
        for r in rp:
            if r.Auth == 5:
                rp= session.query(Projects)
                ProjList.append(rp)
            else:         
                ra = session.query(Access).filter(Access.UserEmail==current_user.email)
                for p in ra:
                    rp= session.query(Projects).filter(Projects.ProjName==p.ProjName)
                    ProjList.append(rp)
        # rv= session.query(User)
        # for i in rv:
        #     #print(i.Username)
        #     if i.email == form.email.data and i.Passwords == form.password.data:
        #         login_user(i,remember=form.remember.data)
        #         flash('You have been logged in!', 'success')
        #         return redirect(url_for('home'))
        #     else:
        #         flash('Login Unsuccessful. Please check username and password', 'danger')

    return render_template('ProjectList.html', title='MY Projects',ProjList =ProjList)

@app.route("/MyProjectTeam")
@login_required
def MyProjectTeam():   
    CurrProjURN = request.args.get('urn')

    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        for r in rPI:
            CurrProjName = r.ProjName
        rPTM = session.query(ProjTeamMatrix).filter(ProjTeamMatrix.ProjName==CurrProjName)
        ReqUserEmail = []
        UserListDict ={}
        for p in rPTM:
            ReqUserEmail.append(p.UserEmail)
            UserListDict[p.HeirarchyInd] = p.UserEmail

        rPT = session.query(ProjTeam).filter(ProjTeam.UserEmail.in_(ReqUserEmail))

    return render_template('ProjectTeamList.html', title='ProjectTeam',ProjTeam = rPT,CurrProjURN=CurrProjURN)

@app.route("/")
@login_required
def index():   
    try:
        CurrProjURN = request.args.get('urn')

        with Session() as session:
            rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
            for r in rPI:
                CurrProjName = r.ProjName

    except Exception as e:
        CurrProjName = "i"
        print(e)
        

    return render_template('layout.html',CurrProjName = CurrProjName)

@app.context_processor
def context_processor():
    try:
        CurrProjURN = request.args.get('urn')

        with Session() as session:
            rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
            for r in rPI:
                CurrProjName = r.ProjName
            print(CurrProjName)
    except Exception as e:
        print(e)
        CurrProjName = ""
    return dict(key = CurrProjName)

@app.route("/Budget")
def Budget():
    return render_template('BudgetSched.html', title='Project Budget & Schedule')

@app.route("/CheckLst")
def CheckLst():
    return render_template('ProjCheckLst.html', title='Project Action Items Check')

@app.route("/MyFilesPg")
def MyFilesPg():
    AllMyFilesImgs = []
    
    CurrProjURN = request.args.get('urn')

    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        for r in rPI:
            CurrProjContainer = r.ProjContainer
    try:
        blob_service_client = BlobServiceClient.from_connection_string('DefaultEndpointsProtocol=https;AccountName=hestiatest;AccountKey=aCm6R0ZF4/SYwDYtj6x+8Ss8kolvUw17mq/S4Hao0b0VZJFsUlU7CoJ/BJuTHL/GwG/rdiPPZwdZ+AStbJ8WYA==;EndpointSuffix=core.windows.net')
        containers = blob_service_client.list_containers(str(CurrProjContainer))
        for c in containers:
            client = blob_service_client.get_container_client(c.name)
            files = ls_files(client, '', recursive=True)
            # ALL FILES IN THE CONTAINER ! (INCLUDING MAIN DIRECTORY)
            print(files)
            for f in files:
                try:
                    imgName = f.split('\\')[1]
                    AllMyFilesImgs.append(imgName)
                    
                except:
                    'skip'
            # NAME OF ALL THE CONTAINERS (PROJECT NAMES) I.E., EACH PROJECT WILL NEED ITS OWN CONTAINER
            print(c.name)
            print(AllMyFilesImgs)

    except Exception as ex:
        print('Exception:')
        print(ex)
    return render_template('MyFilesPg.html', title='Project Files',AllMyFilesImgs=AllMyFilesImgs,CurrProjContainer=CurrProjContainer)

@app.route("/A3Options")
def MyOptionsPg():
    CurrProjURN = request.args.get('urn')

    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        for r in rPI:
            CurrProjName = r.ProjName
        rPTM = session.query(DesOpts).filter(DesOpts.ProjName==CurrProjName)
        
        AccOptList = []
        OptionDict ={}
        #### CONTINUE WORKING FROM HERE : TRY TO CREATE A DICTIONARY WITHIN A DICTIONARY TO CREATE THE DESIGN OPTIONS
        for r in rPTM:
            AccordianTitle = r.MainTitle + "    " + str(r.PostedDate)
            
            try:
                OptionDict[AccordianTitle].append([r.DesOptImgSrc,r.DesOptTitle,r.DesOptDesc])
            except:
                OptionDict[AccordianTitle] = [[r.DesOptImgSrc,r.DesOptTitle,r.DesOptDesc]]
        print(OptionDict)
        #     ReqUserEmail.append(p.UserEmail)
        

        
    return render_template('MyOptionsPg.html', title='Project Design Options',OptionDict = OptionDict)

@app.route("/AddEditMemProfile")
@login_required
def AddEditMemProfile():
    return render_template('AddEditMemProfile.html', title='Add/Edit Member Profile')

@app.route("/CreateNewUser")
@login_required
def CreateNewUser():
    return render_template('CreateNewUser.html', title='Create New User')

@app.route("/CreateNewProj")
@login_required
def CreateNewProj():
 
    return render_template('CreateNewProj.html', title='Create New Project')

@app.route("/EditProj")
@login_required
def EditProj():
 
    return render_template('EditProj.html', title='Edit Project')

@app.route("/EditProjMemProfile")
@login_required
def EditProjMemProfile():

    CurrProjTeamMemEmail = []
    CurrProjURN = request.args.get('urn')
    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        for r in rPI:
            CurrProjName = r.ProjName
        rUI = session.query(ProjTeam)
        UserDict={}
        for Au in rUI:
            UserDict[Au.UserEmail] = Au.MemName

        rs = session.query(ProjTeamMatrix).filter(ProjTeamMatrix.ProjName==CurrProjName)
        for u in rs:
            CurrProjTeamMemEmail.append(u.UserEmail)

    return render_template('EditProjMemProfile.html', title='Edit Project Members Profile',CurrProjTeamMemEmail=CurrProjTeamMemEmail,UserDict=UserDict)

@app.route("/EditProjUserAccss")
@login_required
def EditProjUserAccss():
    CurrProjUserEmail = []
    CurrProjURN = request.args.get('urn')
    with Session() as session:
        rPI = session.query(Projects).filter(Projects.URN==CurrProjURN)
        for r in rPI:
            CurrProjName = r.ProjName
        rUI = session.query(User)
        UserDict={}
        for Au in rUI:
            UserDict[Au.email] = Au.Username

        rs = session.query(Access).filter(Access.ProjName==CurrProjName)
        for u in rs:
            CurrProjUserEmail.append(u.UserEmail)


    return render_template('EditProjUsers.html', title='Edit Project User Access',CurrProjUserEmail=CurrProjUserEmail,UserDict = UserDict)

@app.route("/AssignedMarkups")
@login_required
def AssignedMarkups():
    return render_template('AssignedMarkups.html', title='Assigned Markups')

@app.route("/AdminMarkups")
@login_required
def AdminMarkups():
    return render_template('AdminMarkups.html', title='Admin Markups')

@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))

urlBIM360 = "https://developer.api.autodesk.com/authentication/v1/authenticate"

payloadBIM360='client_id=zEKyfsa9rPYaxIGpAf8YBqQx7grm06T5&client_secret=lSgXNRabvpbVlP0c&grant_type=client_credentials&scope=account%3Awrite%20account%3Aread%20data%3Awrite%20data%3Acreate%20data%3Aread%20bucket%3Aread%20bucket%3Acreate%20code%3Aall'
headersBIM360 = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Cookie': 'PF=cmJ8lIFdaCGpw8kwJRvfwV'
}

responseBIM360 = requests.request("POST", urlBIM360, headers=headersBIM360, data=payloadBIM360)

EverythingBIM360 = response.json()
dataBIM360 = str(EverythingBIM360.get('access_token'))



@app.route("/InternalBIM")
@login_required
def InternalBIM():
    return render_template('index.html', title='Internal BIM',dataBIM360 = dataBIM360)

if __name__ == '__main__':
    app.run(host='localhost', port=5000,debug=True)


# @app.route("/",methods = ['GET','POST'])

# def index():
#     if request.method == 'POST':
#         if 'username' in request.form and 'password' in request.form:
#             username = request.form['username']
#             password = request.form['password']
#             cursor = db.connection.cursor(MySQLdb.cursors.DictCursor)
#             cursor.execute("SELECT * FROM loginInfo WHERE email = %s AND password = %s",(username,password))
#             info = cursor.fetchone()
#             print(info)
#             if info['email'] == username and info['password']==password:
#                 return 'login.html'
#             else:
#                 return"failure"
#     return render_template('ForgeViewer.html')

# if __name__ == '__main__':
#     app.run(debug = True)