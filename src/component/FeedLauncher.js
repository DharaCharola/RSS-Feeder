import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
import MenuIcon from '@material-ui/icons/Menu'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  InputBase,
  IconButton,
  TextField,
  Button,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Grid,
  CssBaseline,
} from '@material-ui/core'
import {
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import API from '../api'
import * as apiList from '../api/apiList'
import Hidden from '@material-ui/core/Hidden'

const drawerWidth = 240

// Styles for layout
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  formPaper: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 'auto',
    padding: 10,
  },
  cardGrid: {
    padding: 15,
  },
  urlText: {
    width: '85%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  formControl: {
    minWidth: 140,
  },
  form: {
    '& .MuiTextField-root': {
      width: 200,
    },
  },
  textFieldWidth: {
    width: 'auto',
  },
  fieldSpace: {
    padding: '10px',
  },
})

class FeedLauncher extends Component {
  state = {
    feedList: [],
    feedUrl: '',
    feeds: {
      link: '',
      list: [],
    },
    // feedData: {},
    themeConfig: {
      fontSize: 14,
      headColor: '#0D47A1',
      backColor: '#90CAF9',
      textColor: '#FFFFFF',
    },
    showDrower: false,
    loading: false,
  }

  componentDidMount() {
    this.getFeedUrlListWithConfig()
    this.fetchPreservedData()
  }

  // Handle theme configuration
  changeThemeConfig = (config, value) => {
    this.setState({
      themeConfig: {
        ...this.state.themeConfig,
        [config]: value,
      },
    })
  }

  // Handle dynamic state change
  handleConfigChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  // ---Start--- Persist configurations in local storage
  fetchPreservedData = () => {
    let data = JSON.parse(localStorage.getItem('feedData'))
    if (data) {
      this.setState(
        {
          feedUrl: data.url,
          themeConfig: data.themeConfig,
        },
        () => {
          this.parseFromRssUrl()
        }
      )
    }
  }

  preserveData = () => {
    const { feedUrl, themeConfig } = this.state
    localStorage.setItem(
      'feedData',
      JSON.stringify({ url: feedUrl, themeConfig })
    )
  }
  // ---End--- Persist configurations in local storage

  // ---Start--- Database operations
  getFeedUrlListWithConfig = () => {
    API.get(apiList.FEEDER)
      .then(({ data }) => {
        this.setState({ feedList: data })
      })
      .catch(error => {
        alert('Something went wrong!')
      })
  }

  getFeedUrlWithConfig = id => {
    API.get(`${apiList.FEEDER}/${id}`)
      .then(({ data }) => {
        let { url, headColor, backColor, textColor, fontSize } = data
        this.setState({
          feedUrl: url,
          themeConfig: {
            headColor,
            backColor,
            textColor,
            fontSize,
          },
        })
        this.parseFromRssUrl()
        this.preserveData()
      })
      .catch(error => {
        alert('Something went wrong!')
      })
  }

  saveConfigs = () => {
    const { feedUrl, themeConfig } = this.state
    this.setState({ loading: true })
    API.post(apiList.FEEDER, {
      url: feedUrl,
      fontSize: themeConfig.fontSize,
      backColor: themeConfig.backColor,
      textColor: themeConfig.textColor,
      headColor: themeConfig.headColor,
    })
      .then(({ data }) => {
        this.setState({
          feedUrl: '',
          feedList: [...this.state.feedList, data],
          themeConfig: {
            fontSize: 14,
            headColor: '#0D47A1',
            backColor: '#90CAF9',
            textColor: '#FFFFFF',
          },
        })
        this.preserveData()
      })
      .catch(error => {
        this.setState({ loading: false })
        alert('Something went wrong!')
      })
  }
  // ---End--- Database operations

  // ---Start--- Fetch RSS feed form given URL and render it with content
  parseFromRssUrl = () => {
    this.setState({ loading: true })
    API.post(apiList.GET_RSS_FEEDS, { feedUrl: this.state.feedUrl })
      .then(({ data }) => {
        this.setState({
          feeds: data,
          loading: false,
        })
      })
      .catch(error => {
        this.setState({ loading: false })
        alert('Something went wrong!')
      })
  }

  renderContent = content => {
    var tmp = document.createElement('div')
    tmp.innerHTML = content
    return tmp.textContent || tmp.innerText || ''
  }

  renderFeeds = classes => {
    const { feeds } = this.state
    return feeds.list.map(feed => {
      let imgsrc = 'assets/images/placeholder.svg'
      let contentdiv = document.createElement('div')
      if (feed['content:encoded']) {
        contentdiv.innerHTML = feed['content:encoded'][0]
        imgsrc = contentdiv.getElementsByTagName('img')[0]
          ? contentdiv.getElementsByTagName('img')[0].src
          : 'assets/images/placeholder.svg'
      }
      return (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  R
                </Avatar>
              }
              title={feed.title[0]}
            />
            <CardMedia className={classes.media} image={imgsrc} />
            <CardContent className={classes.cardTextStyle}>
              <Typography variant="body2" color="textSecondary" component="div">
                {this.renderContent(feed.description[0])}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )
    })
  }
  // ---End--- Fetch RSS feed form given URL and render it with content
  handleDrawerToggle = () => {
    this.setState({ showDrower: !this.state.showDrower })
  }
  render() {
    const { classes } = this.props
    const { feedUrl, loading, themeConfig, feedList, showDrower } = this.state

    // Apply custom theme configuration from react state to UI
    let theme = createMuiTheme({
      overrides: {
        MuiCardHeader: {
          root: {
            backgroundColor: themeConfig.headColor,
          },
        },
        MuiCardContent: {
          root: {
            backgroundColor: themeConfig.backColor,
            maxHeight: '80px',
          },
        },
        MuiTypography: {
          colorTextSecondary: {
            color: themeConfig.textColor,
          },
          body2: {
            fontSize: `${themeConfig.fontSize}px`,
            color: themeConfig.textColor,
          },
        },
      },
    })
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                RSS Feeder
              </Typography>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={showDrower}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <List>
                  {feedList.map((feedInfo, index) => (
                    <ListItem
                      button
                      key={feedInfo._id}
                      onClick={() => this.getFeedUrlWithConfig(feedInfo._id)}
                    >
                      <ListItemText primary={feedInfo.url} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                <List>
                  {feedList.map((feedInfo, index) => (
                    <ListItem
                      button
                      key={feedInfo._id}
                      onClick={() => this.getFeedUrlWithConfig(feedInfo._id)}
                    >
                      <ListItemText primary={feedInfo.url} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </Hidden>
          </nav>

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid container spacing={0}>
              <Grid item xs={12} sm={9} className={classes.fieldSpace}>
                <TextField
                  label="Please enter RSS feed URL here"
                  type="text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  // className={classes.urlText}
                  name="feedUrl"
                  value={feedUrl}
                  onChange={this.handleConfigChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} className={classes.fieldSpace}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.parseFromRssUrl}
                  disabled={feedUrl === ''}
                  fullWidth
                >
                  Create Feed
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <TextField
                  fullWidth
                  label="Header"
                  variant="outlined"
                  type="color"
                  size="small"
                  value={themeConfig.headColor}
                  onChange={e =>
                    this.setState({
                      themeConfig: {
                        ...this.state.themeConfig,
                        headColor: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <TextField
                  fullWidth
                  label="Back"
                  variant="outlined"
                  type="color"
                  size="small"
                  value={themeConfig.backColor}
                  onChange={e =>
                    this.setState({
                      themeConfig: {
                        ...this.state.themeConfig,
                        backColor: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <TextField
                  fullWidth
                  label="Text"
                  variant="outlined"
                  size="small"
                  type="color"
                  value={themeConfig.textColor}
                  onChange={e =>
                    this.setState({
                      themeConfig: {
                        ...this.state.themeConfig,
                        textColor: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <TextField
                  fullWidth
                  label="Font"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={themeConfig.fontSize}
                  onChange={e =>
                    this.setState({
                      themeConfig: {
                        ...this.state.themeConfig,
                        fontSize: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <TextField
                  label="Box Size"
                  fullWidth
                  variant="outlined"
                  type="color"
                  size="small"
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                lg={2}
                className={classes.fieldSpace}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={
                    themeConfig.headColor === '' ||
                    themeConfig.backColor === '' ||
                    themeConfig.textColor === '' ||
                    themeConfig.feedUrl === '' ||
                    themeConfig.fontSize === '' ||
                    loading
                  }
                  onClick={this.saveConfigs}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.cardGrid}>
              {loading ? (
                <Grid item xs={12}>
                  <Typography component="span">Loading...</Typography>
                </Grid>
              ) : (
                this.renderFeeds(classes)
              )}
            </Grid>
          </main>
        </div>
      </ThemeProvider>
    )
  }
}
export default withStyles(styles)(FeedLauncher)
