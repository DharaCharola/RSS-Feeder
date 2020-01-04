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
import { SketchPicker } from 'react-color'
import { withStyles } from '@material-ui/core/styles'
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
  card: {
    width: '',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
})

class FeedLauncher extends Component {
  state = {
    feeds: [],
    feedUrl: '',
    loading: false,
  }

  renderFeeds = classes => {
    const { feeds } = this.state
    return feeds.map(feed => {
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
            <CardContent>
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
    API.get(apiList.GET_RSS_FEEDS)
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
    this.setState({ [name]: value })
  }

  render() {
    const { classes } = this.props
    const { feedUrl, loading } = this.state
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
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
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
              id="outlined-password-input"
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
            <TextField
              id="outlined-password-input"
              label="Font Size"
              type="text"
              variant="outlined"
              size="small"
            />
            <TextField
              id="outlined-password-input"
              label="Headline Color"
              type="text"
              variant="outlined"
              size="small"
            />
            <TextField
              id="outlined-password-input"
              label="Text Color"
              type="text"
              variant="outlined"
              size="small"
            />
            <TextField
              id="outlined-password-input"
              label="Background Color"
              type="text"
              variant="outlined"
              size="small"
            />
            {/* <SketchPicker
            // color={this.state.newLabelColor}
            // onChangeComplete={this.handleColorChange}
            width="92%"
          /> */}

            <Button variant="contained" color="primary">
              Save
            </Button>
          </Paper>
          <Grid container spacing={3} className={classes.cardGrid}>
            {loading ? <div>Loading....</div> : this.renderFeeds(classes)}
          </Grid>
        </main>
      </div>
    )
  }
}
export default withStyles(styles)(FeedLauncher)
