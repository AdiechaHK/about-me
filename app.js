
Vue.filter('ucfirst', input => {
  return input.split(" ").map(
    word => word.substr(0,1).toUpperCase() + word.substr(1).toLowerCase()
  ).join(" ");
});

Vue.filter('dt', input => {
  return input ? moment(input, "MM-DD-YYYY").format("MMM YYYY"): "now"
});

Vue.filter('period', (input, no_per = "No experience") => {
  let total_months = Math.ceil(input)
  if (total_months === 0) {
    return no_per;
  }
  let m = total_months % 12;
  let y = Math.floor(total_months/12);
  let year = y > 0 ? ([y, y > 1 ? "years": "year"].join(" ")): ""
  let month = m > 0 ? ([m, m > 1? "months": "month"].join(" ")): ""
  return [year, month].join(" ").trim()
});

const get_diff = ({from, to}) => {
  let from_dt = from ? moment(from, "MM-DD-YYYY"): moment()
  let to_dt = to ? moment(to, "MM-DD-YYYY"): moment()
  return to_dt.diff(from_dt, 'months', true)
}

Vue.filter('months', get_diff);

Vue.filter('skill_title', (input, prof) => {
  return input + " (" + prof + "% proficiency)";
})

Vue.filter('mob_link', input => {
  return "tel:" + input.split("-").join("")
});

Vue.filter('mail_link', input => {
  return "mailto:" + input
});

const app = new Vue({
  el: "#app",
  data: {
    profile: {},
    skills: [],
    show_projects: 'limited',
    show_experiences: 'limited',
    limit: 3
  },
  mounted: async function() {
    let res = await axios.get('/profile.json')
    this.profile = res.data
    console.log(this.profile)
  },
  methods: {
    toggleSkill(s) {
      let indx = this.skills.indexOf(s);
      indx === -1? this.skills.push(s): this.skills.splice(indx, 1);
    }
  },
  computed: {
    sorted_experience() {
      if(this.profile && this.profile.experience && this.profile.experience.length > 0) {
        return this.profile.experience?.sort((a, b) => {
          return moment(b.from, "MM-DD-YYYY").diff(moment(a.from, "MM-DD-YYYY"));
        })?.filter(exp => {
          return this.skills?.length === 0 || exp.skills?.reduce((cond, skill) => {
            return cond || this.skills.includes(skill);
          }, false);
        });
      }
      return [];
    },
    filtered_projects() {
      if(this.profile && this.profile.projects && this.profile.projects.length > 0) {
        return this.profile.projects?.sort((a, b) => b.year - a.year)?.filter(proj => {
          return this.skills.length === 0 || proj.skills?.reduce((cond, skill) => {
            return cond || this.skills.includes(skill);
          }, false);
        })
      }
      return []
    },
    total_exp() {
      return this.sorted_experience?.reduce((texp, exp) => texp + get_diff(exp), 0) || 0;
    }
  }
});


const head = new Vue({
  el: "#head",
  data: {
    title: "Loading...",
    picture: "",
    active: true,
    meta: {}
  },
  mounted: async function() {
    // const profileUpdate = () => this.profile = {name: "Harikrushna"}
    // setTimeout(profileUpdate, 3000)
    res = await axios.get('/config.json');
    this.meta = res.data.meta

    // Set Default
    this.title = this.meta.active_title
    this.picture = this.meta.active_pic
  },
  methods: {
    focus() {
      this.title = this.meta.active_title
      this.picture = this.meta.active_pic
      this.active = true
    }, 
    blur() {
      this.active = false
      this.title = this.meta.passive_title
      this.picture = this.meta.passive_pic
    }
  },
  created() {
    window.addEventListener('focus',this.focus);
    window.addEventListener('blur',this.blur);
  },
  destroyed() {
    window.removeEventListener('focus',this.focus);
    window.removeEventListener('blur',this.blur);
  }
});

