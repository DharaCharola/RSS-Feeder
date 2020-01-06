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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  withTheme,
} from '@material-ui/core'
import { SketchPicker } from 'react-color'
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
  cardTextStyle: {
    color: 'red',
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
    loading: false,
    themeConfig: {
      fontSize: 18,
      headlineColor: '#000000',
      backColor: '#AAAAAA',
      textColor: '#000000',
    },
  }

  componentDidMount() {
    this.getFeedUrlsWithConfig()
  }
  changeThemeConfig = (config, value) => {
    this.setState({
      themeConfig: {
        ...this.state.themeConfig,
        [config]: value,
      },
    })
  }

  renderFeeds = classes => {
    const { feeds } = this.state
    return feeds.list.map(feed => {
      let contentdiv = document.createElement('div')
      contentdiv.innerHTML = feed['content:encoded'][0]
      let imgsrc = contentdiv.getElementsByTagName('img')[0]
        ? contentdiv.getElementsByTagName('img')[0].src
        : ''
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
              <Typography
                variant="body2"
                color="textSecondary"
                component="div"
                noWrap={false}

                // dangerouslySetInnerHTML={{
                //   __html: feed.description[0],
                // }}
              >
                Setting up a website for your business is quite crucial these
                days. And this goes for a brick and mortar company too —
                regardless your business operates online or offline. The thing
                is: Without a solid website, you are missing a huge chunk o
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
    // https://www.techuz.com/blog/feed/
  }

  handleConfigChange = event => {
    const { name, value } = event.target
    this.setState({
      [name]: value,
    })
  }

  getFeedUrlsWithConfig = () => {
    API.get(apiList.FEEDER)
      .then(({ data }) => {
        this.setState({ feedList: data })
      })
      .catch(error => {
        this.setState({ loading: false })
      })
  }

  saveConfigs = () => {
    const { feeds, themeConfig } = this.state
    API.post(apiList.FEEDER, {
      url: feeds.link,
      fontSize: themeConfig.fontSize,
      backColor: themeConfig.backColor,
      textColor: themeConfig.textColor,
      headlineColor: themeConfig.headlineColor,
    })
      .then(({ data }) => {
        this.getFeedUrlsWithConfig()
      })
      .catch(error => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { classes, theme } = this.props
    const { feedUrl, loading, themeConfig, feedList } = this.state
    const customTheme = createMuiTheme({
      themeConfig,
    })
    return (
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
              <ListItem button key={feedInfo.url}>
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
            className={classes.formPaper}
            variant="outlined"
          >
            <FormControl
              variant="outlined"
              className={classes.formControl}
              size="small"
            >
              <InputLabel shrink id="demo-simple-select-outlined-label">
                Font Size
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={e =>
                  this.changeThemeConfig('fontSize', e.target.value)
                }
                value={themeConfig.fontSize}
                // onChange={handleChange}
                // labelWidth={labelWidth}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={24}>24</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <label>HeadLine Color</label>
              <input
                value={themeConfig.headlineColor}
                type="color"
                name="headlineColor"
                onChange={e =>
                  this.changeThemeConfig('headlineColor', e.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <label>Text Color</label>
              <input
                value={themeConfig.textColor}
                type="color"
                name="textColor"
                onChange={e =>
                  this.changeThemeConfig('textColor', e.target.value)
                }
              />
            </FormControl>
            <FormControl>
              <label>Back Color</label>
              <input
                value={themeConfig.backColor}
                type="color"
                name="backColor"
                onChange={e =>
                  this.changeThemeConfig('backColor', e.target.value)
                }
              />
            </FormControl>
            {/* <TextField
              label="Text Color"
              type="color"
              variant="outlined"
              size="small"
            />
            <TextField
              label="Background Color"
              type="color"
              variant="outlined"
              size="small"
            /> */}
            <Button
              variant="contained"
              color="primary"
              onClick={this.saveConfigs}
            >
              Save
            </Button>
          </Paper>
          <ThemeProvider theme={customTheme}>
            <Grid container spacing={3} className={classes.cardGrid}>
              {loading ? <div>Loading....</div> : this.renderFeeds(classes)}
            </Grid>
          </ThemeProvider>
        </main>
      </div>
    )
  }
}
export default withTheme(withStyles(styles)(FeedLauncher))
