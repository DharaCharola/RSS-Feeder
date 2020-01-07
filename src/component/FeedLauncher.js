import React, { Component } from 'react'
import Container from '@material-ui/core/Container'
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
} from '@material-ui/core'
import {
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles'
import API from '../api'
import * as apiList from '../api/apiList'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
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
    marginTop: 30,
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
})

class FeedLauncher extends Component {
  state = {
    feeds: {
      link: '',
      list: [],
    },
    feedList: [],
    feedUrl: '',
    feedData: {},
    themeConfig: {
      fontSize: 14,
      headColor: '#AEAEAE',
      backColor: '#AAAAAA',
      textColor: '#FFFFFF',
    },
    loading: false,
  }

  componentDidMount() {
    this.getFeedUrlListWithConfig()
    this.fetchPreservedData()
  }

  changeThemeConfig = (config, value) => {
    this.setState({
      themeConfig: {
        ...this.state.themeConfig,
        [config]: value,
      },
    })
  }

  returnContent = content => {
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
        <Grid item xs={4}>
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
                {this.returnContent(feed.description[0])}
                {/* <div
                  dangerouslySetInnerHTML={{
                    __html: feed.description[0],
                  }}
                ></div> */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )
    })
  }

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
      })
  }

  handleConfigChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  getFeedUrlListWithConfig = () => {
    API.get(apiList.FEEDER)
      .then(({ data }) => {
        this.setState({ feedList: data })
      })
      .catch(error => {
        this.setState({ loading: false })
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
      .catch(error => {})
  }

  saveConfigs = () => {
    const { feedUrl, themeConfig } = this.state
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
            headColor: '#AEAEAE',
            backColor: '#AAAAAA',
            textColor: '#FFFFFF',
          },
        })
        this.preserveData()
      })
      .catch(error => {
        this.setState({ loading: false })
      })
  }

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

  render() {
    const { classes } = this.props
    const { feedUrl, loading, themeConfig, feedList } = this.state
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
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                RSS Feeder
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
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

          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Paper
              component="form"
              className={classes.formPaper}
              variant="outlined"
            >
              <TextField
                label="Please enter RSS feed URL here"
                type="text"
                variant="outlined"
                size="small"
                className={classes.urlText}
                name="feedUrl"
                value={feedUrl}
                onChange={this.handleConfigChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.parseFromRssUrl}
                disabled={feedUrl === ''}
              >
                Create Feed
              </Button>
            </Paper>
            <Paper
              component="form"
              className={`${classes.formPaper} ${classes.form}`}
              variant="outlined"
            >
              <TextField
                className={classes.textFieldWidth}
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
              <TextField
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
              <TextField
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
              <TextField
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
              <Button
                variant="contained"
                color="primary"
                onClick={this.saveConfigs}
              >
                Save
              </Button>
            </Paper>

            <Grid
              container
              justify="center"
              spacing={3}
              className={classes.cardGrid}
            >
              {loading ? (
                <div>
                  <Typography component="span">Loading...</Typography>.
                </div>
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
