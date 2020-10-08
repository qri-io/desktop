import React from 'react'

import DatasetDetailsSubtext from '../app/components/dataset/DatasetDetailsSubtext'
import { Dataset as IDataset } from '../app/models/dataset'
import { VersionInfo } from '../app/models/store'
import TitleBar from '../app/components/dataset/TitleBar'
import Overview from '../app/components/dataset/Overview'
import Dataset from '../app/components/dataset/Dataset'
// import Navbar from '../app/components/nav/Navbar'
import { ActionButtonProps } from '../app/components/chrome/ActionButton'
import BodySegment from '../app/components/dataset/BodySegment'
const cities = require('./data/cities.dataset.json')

export default {
  title: 'Dataset',
  parameters: {
    notes: `Dataset components`
  }
}

const titleBarActions: ActionButtonProps[] = [
  { icon: 'publish', text: 'Publish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Publish!', e) } },
  { icon: 'close', text: 'Unpublish', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('UnPublish!', e) } },
  { icon: 'openInFinder', text: 'Open in finder', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Open in Finder!', e) } },
  { icon: 'clone', text: 'Clone', onClick: (e: MouseEvent<Element, MouseEvent>) => { console.log('Clone!', e) } }
]

export const titleBar = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding: 15 }}>
      <TitleBar icon='structure' title='Short test title' data={titleBarActions} />
      <TitleBar title='Long test title with no icon that should overflow ellipsis unless you click it in which case it should expand' data={titleBarActions} />
    </div>
  )
}

titleBar.story = {
  name: 'Title Bar',
  parameters: {
    notes: 'four actions max will appear at the top bar, if the title is long or the space is small, they will collapse into the hamburger'
  }
}

export const detailsSubtext = () => {
  const data = versionInfoDataset
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' />
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} size='sm' color='light' noTimestamp />
      </div>
      <div style={{ background: 'grey' }}>
        <DatasetDetailsSubtext data={data} color='light' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='muted' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} size='sm' color='dark' noTimestamp/>
      </div>
      <div>
        <DatasetDetailsSubtext data={data} color='dark' noTimestamp />
      </div>
    </div>
  )
}

detailsSubtext.story = {
  name: 'Details Subtext',
  parameters: {
    notes: 'sm/md, light/muted/dark'
  }
}

const versionInfoDataset: VersionInfo =  {
  username: 'owner-username',
  profileId: '123',
  name: 'jeopardy_questions',
  path: '/ipfs/QmY9WcXXUnHJbYRA28LRctiL4qu4y',
  fsiPath: '/path/to/local',
  foreign: true,
  metaTitle: 'Jeopardy questions throughout time',
  themeList: "trivia,questions",
  bodyFormat: 'json',
  commitTitle: 'initial commit',
  commitMessage: 'uploading bank of all jeopardy questions',
  commitTime: new Date('2020-07-13'),
}

const overviewDataset: IDataset = {
  meta: {
    title: 'Earthquakes in the last month',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    theme: ['geology']
  },
  structure: {
    format: 'csv',
    length: 24000000,
    depth: 2,
    entries: 2206,
    errCount: 0
  },
  commit: {
    author: 'chriswhong',
    title: 'Added metadata',
    timestamp: new Date(1579892323028),
    count: 247
  },
  body: [["","","","","","","TW","TWN",158,"","","","","","","","","","","","","","","","","","","Taiwan","Taipei","AS","RC","",886,"","TPE","TW",925,1668284,"","","TPE","","","","","zh-TW,zh,nan,hak","","ch","","","","","",".tw","","Yes"],["أفغانستان","阿富汗","Afghanistan","Afganistán","Afghanistan","Афганистан","AF","AFG",4,"AFN","AFGHANISTAN",2,"Afghani",971,4,"جمهورية أفغانستان الإسلامية","أفغانستان","阿富汗伊斯兰共和国","阿富汗","the Islamic Republic of Afghanistan","Afghanistan","République islamique d'Afghanistan","Afghanistan (l') [masc.]","Исламская Республика Афганистан","Афганистан","República Islámica del Afganistán (la)","Afganistán (el)","Afghanistan","Kabul","AS","AFG","Developing",93,"B2","AFG","AF",1,1149361,"True","World","AFG","AFG","","","x","fa-AF,ps,uz-AF,tk","x","af",142,"Asia","",34,"Southern Asia",".af","AF","Yes"],["ألبانيا","阿尔巴尼亚","Albania","Albania","Albanie","Албания","AL","ALB",8,"ALL","ALBANIA",2,"Lek",8,8,"جمهورية ألبانيا","ألبانيا","阿尔巴尼亚共和国","阿尔巴尼亚","the Republic of Albania","Albania","la République d'Albanie","Albanie (l') [fém.]","Республика Албания","Албания","la República de Albania","Albania","Albania","Tirana","EU","AL","Developed",355,"B3","ALB","AL",3,783754,"True","World","ALB","ALB","","","","sq,el","","aa",150,"Europe","",39,"Southern Europe",".al","AB","Yes"],["الجزائر","阿尔及利亚","Algeria","Argelia","Algérie","Алжир","DZ","DZA",12,"DZD","ALGERIA",2,"Algerian Dinar",12,12,"الجمهورية الجزائرية الديمقراطية الشعبية","الجزائر","阿尔及利亚民主人民共和国","阿尔及利亚","the People's Democratic Republic of Algeria","Algeria","la République algérienne démocratique et populaire","Algérie (l') [fém.]","Алжирская Народная Демократическая Республика","Алжир","la República Argelina Democrática y Popular","Argelia","Algeria","Algiers","AF","DZ","Developing",213,"B4","ALG","AG",4,2589581,"True","World","ALG","ALG","","","","ar-DZ","","ae",2,"Africa","",15,"Northern Africa",".dz","AL","Yes"],["ساموا الأمريكية","美属萨摩亚","American Samoa","Samoa Americana","Samoa américaines","Американское Самоа","AS","ASM",16,"USD","AMERICAN SAMOA",2,"US Dollar",840,16,"","","","","","","","","","","","","American Samoa","Pago Pago","OC","USA","Developing","1-684","B5","ASA","AQ",5,5880801,"True","World","ASA","SMA","","","","en-AS,sm,to","","as",9,"Oceania","x",61,"Polynesia",".as","","Territory of US"],["أندورا","安道尔","Andorra","Andorra","Andorre","Андорра","AD","AND",20,"EUR","ANDORRA",2,"Euro",978,20,"إمارة أندورا","أندورا","安道尔公国","安道尔","the Principality of Andorra","Andorra","la Principauté d'Andorre","Andorre (l') [fém.]","Княжество Андорра","Андорра","el Principado de Andorra","Andorra","Andorra","Andorra la Vella","EU","AND","Developed",376,"B6","AND","AN",7,3041565,"True","World","AND","AND","","","","ca","","an",150,"Europe","",39,"Southern Europe",".ad","","Yes"],["أنغولا","安哥拉","Angola","Angola","Angola","Ангола","AO","AGO",24,"AOA","ANGOLA",2,"Kwanza",973,24,"جمهورية أنغولا","أنغولا","安哥拉共和国","安哥拉","the Republic of Angola","Angola","la République d'Angola","Angola (l') [masc.]","Республика Ангола","Ангола","la República de Angola","Angola","Angola","Luanda","AF","AO","Developing",244,"B7","ANG","AO",8,3351879,"True","World","ANG","AGL","17","Middle Africa","","pt-AO","x","ao",2,"Africa","",202,"Sub-Saharan Africa",".ao","AN","Yes"],["أنغيلا","安圭拉","Anguilla","Anguila","Anguilla","Ангилья","AI","AIA",660,"XCD","ANGUILLA",2,"East Caribbean Dollar",951,660,"","","","","","","","","","","","","Anguilla","The Valley","NA","","Developing","1-264","1A","AIA","AV",9,3573511,"True","World","AIA","AIA","29","Caribbean","","en-AI","","am",19,"Americas","x",419,"Latin America and the Caribbean",".ai","","Territory of GB"],["أنتاركتيكا","南极洲","Antarctica","Antártida","Antarctique","Антарктике","AQ","ATA",10,"","ANTARCTICA","","No universal currency","",10,"","","","","","","","","","","","","Antarctica","","AN","","",672,"B8","ROS","AY",10,6697173,"True","World","","","","","","","","ay","","","","","",".aq","AA","International"],["أنتيغوا وبربودا","安提瓜和巴布达","Antigua and Barbuda","Antigua y Barbuda","Antigua-et-Barbuda","Антигуа и Барбуда","AG","ATG",28,"XCD","ANTIGUA AND BARBUDA",2,"East Caribbean Dollar",951,28,"أنتيغوا وبربودا","أنتيغوا وبربودا","安提瓜和巴布达","安提瓜和巴布达","Antigua and Barbuda","Antigua and Barbuda","Antigua-et-Barbuda [fém.]","Antigua-et-Barbuda [fém.]","Антигуа и Барбуда","Антигуа и Барбуда","Antigua y Barbuda","Antigua y Barbuda","Antigua \u0026 Barbuda","St. John's","NA","","Developing","1-268","B9","ATG","AC",11,3576396,"True","World","ANT","ATG","29","Caribbean","","en-AG","","aq",19,"Americas","x",419,"Latin America and the Caribbean",".ag","AT","Yes"],["الأرجنتين","阿根廷","Argentina","Argentina","Argentine","Аргентина","AR","ARG",32,"ARS","ARGENTINA",2,"Argentine Peso",32,32,"جمهورية الأرجنتين","الأرجنتين","阿根廷共和国","阿根廷","the Argentine Republic","Argentina","la République argentine","Argentine (l') [fém.]","Аргентинская Республика","Аргентина","la República Argentina","Argentina (la)","Argentina","Buenos Aires","SA","RA","Developing",54,"C1","ARG","AR",12,3865483,"True","World","ARG","ARG","5","South America","","es-AR,en,it,de,fr,gn","","ag",19,"Americas","",419,"Latin America and the Caribbean",".ar","AG","Yes"],["أرمينيا","亚美尼亚","Armenia","Armenia","Arménie","Армения","AM","ARM",51,"AMD","ARMENIA",2,"Armenian Dram",51,51,"جمهورية أرمينيا","أرمينيا","亚美尼亚共和国","亚美尼亚","the Republic of Armenia","Armenia","la République d'Arménie","Arménie (l') [fém.]","Республика Армения","Армения","la República de Armenia","Armenia","Armenia","Yerevan","AS","AM","Developing",374,"1B","ARM","AM",13,174982,"True","World","ARM","ARM","","","x","hy","","ai",142,"Asia","",145,"Western Asia",".am","AY","Yes"],["أروبا","阿鲁巴","Aruba","Aruba","Aruba","Аруба","AW","ABW",533,"AWG","ARUBA",2,"Aruban Florin",533,533,"","","","","","","","","","","","","Aruba","Oranjestad","NA","AW","Developing",297,"1C","ARU","AA",14,3577279,"True","World","ARU","ABW","29","Caribbean","","nl-AW,es,en","","aw",19,"Americas","x",419,"Latin America and the Caribbean",".aw","NU","Part of NL"],["أستراليا","澳大利亚","Australia","Australia","Australie","Австралия","AU","AUS",36,"AUD","AUSTRALIA",2,"Australian Dollar",36,36,"أستراليا","أستراليا","澳大利亚","澳大利亚","Australia","Australia","l'Australie","Australie (l') [fém.]","Австралия","Австралия","Australia","Australia","Australia","Canberra","OC","AUS","Developed",61,"C3","AUS","AS",17,2077456,"True","World","AUS","AUS","","","","en-AU","","at",9,"Oceania","",53,"Australia and New Zealand",".au","AU","Yes"],["النمسا","奥地利","Austria","Austria","Autriche","Австрия","AT","AUT",40,"EUR","AUSTRIA",2,"Euro",978,40,"جمهورية النمسا","النمسا","奥地利共和国","奥地利","the Republic of Austria","Austria","la République d'Autriche","Autriche (l') [fém.]","Австрийская Республика","Австрия","la República de Austria","Austria","Austria","Vienna","EU","A","Developed",43,"C4","AUT","AU",18,2782113,"True","World","AUT","AUT","","","","de-AT,hr,hu,sl","","au",150,"Europe","",155,"Western Europe",".at","OS","Yes"],["أذربيجان","阿塞拜疆","Azerbaijan","Azerbaiyán","Azerbaïdjan","Азербайджан","AZ","AZE",31,"AZN","AZERBAIJAN",2,"Azerbaijan Manat",944,31,"جمهورية أذربيجان","أذربيجان","阿塞拜疆共和国","阿塞拜疆","the Republic of Azerbaijan","Azerbaijan","la République d'Azerbaïdjan","Azerbaïdjan (l') [masc.]","Азербайджанская Республика","Азербайджан","la República de Azerbaiyán","Azerbaiyán","Azerbaijan","Baku","AS","AZ","Developing",994,"1D","AZE","AJ",19,587116,"True","World","AZE","AZE","","","x","az,ru,hy","","aj",142,"Asia","",145,"Western Asia",".az","AJ","Yes"],["جزر البهاما","巴哈马","Bahamas","Bahamas","Bahamas","Багамские Острова","BS","BHS",44,"BSD","BAHAMAS",2,"Bahamian Dollar",44,44,"كمنولث جزر البهاما","جزر البهاما","巴哈马国","巴哈马","the Commonwealth of the Bahamas","Bahamas (the)","le Commonwealth des Bahamas","Bahamas (les) [fém.]","Содружество Багамских Островов","Багамские Острова","el Commonwealth de las Bahamas","Bahamas (las)","Bahamas","Nassau","NA","BS","Developing","1-242","C5","BAH","BF",20,3572887,"True","World","BAH","BAH","29","Caribbean","","en-BS","","bf",19,"Americas","x",419,"Latin America and the Caribbean",".bs","BA","Yes"],["البحرين","巴林","Bahrain","Bahrein","Bahreïn","Бахрейн","BH","BHR",48,"BHD","BAHRAIN",3,"Bahraini Dinar",48,48,"مملكة البحرين","البحرين","巴林王国","巴林","the Kingdom of Bahrain","Bahrain","le Royaume de Bahreïn","Bahreïn [masc.]","Королевство Бахрейн","Бахрейн","el Reino de Bahrein","Bahrein","Bahrain","Manama","AS","BRN","Developing",973,"C6","BHR","BA",21,290291,"True","World","BRN","BHR","","","","ar-BH,en,fa,ur","","ba",142,"Asia","",145,"Western Asia",".bh","BN","Yes"],["بنغلاديش","孟加拉国","Bangladesh","Bangladesh","Bangladesh","Бангладеш","BD","BGD",50,"BDT","BANGLADESH",2,"Taka",50,50,"جمهورية بنغلاديش الشعبية","بنغلاديش","孟加拉人民共和国","孟加拉国","the People's Republic of Bangladesh","Bangladesh","la République populaire du Bangladesh","Bangladesh (le)","Народная Республика Бангладеш","Бангладеш","la República Popular de Bangladesh","Bangladesh","Bangladesh","Dhaka","AS","BD","Developing",880,"C7","BAN","BG",23,1210997,"True","World","BAN","BGD","","","","bn-BD,en","x","bg",142,"Asia","",34,"Southern Asia",".bd","BW","Yes"],["بربادوس","巴巴多斯","Barbados","Barbados","Barbade","Барбадос","BB","BRB",52,"BBD","BARBADOS",2,"Barbados Dollar",52,52,"بربادوس","بربادوس","巴巴多斯","巴巴多斯","Barbados","Barbados","la Barbade","Barbade (la)","Барбадос","Барбадос","Barbados","Barbados","Barbados","Bridgetown","NA","BDS","Developing","1-246","C8","BRB","BB",24,3374084,"True","World","BAR","BRB","29","Caribbean","","en-BB","","bb",19,"Americas","x",419,"Latin America and the Caribbean",".bb","BR","Yes"],["بيلاروس","白俄罗斯","Belarus","Belarús","Bélarus","Беларусь","BY","BLR",112,"BYN","BELARUS",2,"Belarusian Ruble",933,112,"جمهورية بيلاروس","بيلاروس","白俄罗斯共和国","白俄罗斯","the Republic of Belarus","Belarus","la République du Bélarus","Bélarus (le)","Республика Беларусь","Беларусь","la República de Belarús","Belarús","Belarus","Minsk","EU","BY","Developed",375,"1F","BLR","BO",26,630336,"True","World","BLR","BLR","","","","be,ru","","bw",150,"Europe","",151,"Eastern Europe",".by","BY","Yes"],["بلجيكا","比利时","Belgium","Bélgica","Belgique","Бельгия","BE","BEL",56,"EUR","BELGIUM",2,"Euro",978,56,"مملكة بلجيكا","بلجيكا","比利时王国","比利时","the Kingdom of Belgium","Belgium","le Royaume de Belgique","Belgique (la)","Королевство Бельгия","Бельгия","el Reino de Bélgica","Bélgica","Belgium","Brussels","EU","B","Developed",32,"C9","BEL","BE",27,2802361,"True","World","BEL","BEL","","","","nl-BE,fr-BE,de-BE","","be",150,"Europe","",155,"Western Europe",".be","BX","Yes"],["بليز","伯利兹","Belize","Belice","Belize","Белиз","BZ","BLZ",84,"BZD","BELIZE",2,"Belize Dollar",84,84,"بليز","بليز","伯利兹","伯利兹","Belize","Belize","le Belize","Belize (le)","Белиз","Белиз","Belice","Belice","Belize","Belmopan","NA","BH","Developing",501,"D1","BLZ","BH",28,3582678,"True","World","BIZ","BLZ","13","Central America","","en-BZ,es","","bh",19,"Americas","x",419,"Latin America and the Caribbean",".bz","BH","Yes"],["بنن","贝宁","Benin","Benin","Bénin","Бенин","BJ","BEN",204,"XOF","BENIN",0,"CFA Franc BCEAO",952,204,"جمهورية بنن","بنن","贝宁共和国","贝宁","the Republic of Benin","Benin","la République du Bénin","Bénin (le)","Республика Бенин","Бенин","la República de Benin","Benin","Benin","Porto-Novo","AF","DY","Developing",229,"G6","BEN","BN",29,2395170,"True","World","BEN","BEN","11","Western Africa","","fr-BJ","x","dm",2,"Africa","",202,"Sub-Saharan Africa",".bj","BJ","Yes"],["برمودا","百慕大","Bermuda","Bermuda","Bermudes","Бермудские острова","BM","BMU",60,"BMD","BERMUDA",2,"Bermudian Dollar",60,60,"","","","","","","","","","","","","Bermuda","Hamilton","NA","BM","Developed","1-441","D0","BER","BD",30,3573345,"True","World","BER","BER","","","","en-BM,pt","","bm",19,"Americas","",21,"Northern America",".bm","BE","Territory of GB"],["بوتان","不丹","Bhutan","Bhután","Bhoutan","Бутан","BT","BTN",64,"INR,BTN","BHUTAN","2,2","Indian Rupee,Ngultrum","356,064",64,"مملكة بوتان","بوتان","不丹王国","不丹","the Kingdom of Bhutan","Bhutan","le Royaume du Bhoutan","Bhoutan (le)","Королевство Бутан","Бутан","el Reino de Bhután","Bhután","Bhutan","Thimphu","AS","BT","Developing",975,"D2","BHU","BT",31,1252634,"True","World","BHU","BTN","","","x","dz","x","bt",142,"Asia","",34,"Southern Asia",".bt","","Yes"],["بوليفيا (دولة - المتعددة القوميات)","玻利维亚(多民族国)","Bolivia (Plurinational State of)","Bolivia (Estado Plurinacional de)","Bolivie (État plurinational de)","Боливия (Многонациональное Государство)","BO","BOL",68,"BOB","BOLIVIA (PLURINATIONAL STATE OF)",2,"Boliviano",68,68,"دولة بوليفيا المتعددة القوميات","بوليفيا (دولة - المتعددة القوميات)","玻利维亚多民族国","玻利维亚（多民族国）","the Plurinational State of Bolivia","Bolivia (Plurinational State of)","État plurinational de Bolivie","Bolivie (État plurinational de) (l')","Многонациональное Государство Боливия","Боливия (Многонациональное Государство)","Estado Plurinacional de Bolivia","Bolivia (Estado Plurinacional de)","Bolivia","Sucre","SA","BOL","Developing",591,"","BOL","BL",33,3923057,"True","World","BOL","BOL","5","South America","x","es-BO,qu,ay","","bo",19,"Americas","",419,"Latin America and the Caribbean",".bo","BO","Yes"]]
}

export const overview = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: 20 }}>
      <Overview data={overviewDataset} actions={[]}/>
    </div>
  )
}

export const bodySegment = () => {
  return (
    <div style={{padding: 20, width: '100%', height: '100%'}}>
      <BodySegment data={overviewDataset} />
    </div>
  )
}

// export const dataset = () => {
//   return(
//     <div style={{padding: 20, width: '100%', height: '100%'}}>
//       <Dataset data={overviewDataset} />
//   </div>
//   )
// }