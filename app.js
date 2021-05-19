import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';


const order = { CRITICAL: 5, HIGH: 4, MEDIUM: 3, LOW: 2, UNKNOWN: 1 };

const Severity = styled.div`
         color: white;
         background-color: ${color => getBackground(color)};
         width: 70px;
         text-align: center;
         border-radius: 3px;

    `

const Vuln = (props) => {


    return (
        <div className="packages-cont ml-4 mt-1 mb-1" key={props.index}>
            <div className="d-inline-block" style={{width: "200px"}}><a href={props.link} target="_blank">{props.VulnerabilityID}</a></div>
            <div className="d-inline-block" style={{width: "120px"}}><Severity color={props.Severity}>{props.Severity}</Severity></div>
            <div className="d-inline-block" style={{width: "250px"}}>{truncateString(props.package, 27)}</div>
            <div className="d-inline-block" style={{width: "110px", textAlign: "center"}}>{props?.CVSS?.nvd?.V3Score}</div>
            <div className="d-inline-block" style={{width: "170px"}}>{props.installed_version}</div>
            <div className="d-inline-block" style={{width: "200px"}}>{props.FixedVersion}</div>
        </div>
    )
}

const VulnHeader = (props) => {

    const handleClick = (e) => {
        if(e.target.className.includes("sort-down")) {
            e.target.classList.remove("bi-sort-down");
            e.target.classList.add("bi-sort-up");
            props.onSort(e.target.id, 'desc');
        }else {
            e.target.classList.remove("bi-sort-up");
            e.target.classList.add("bi-sort-down");
            props.onSort(e.target.id, 'asc');
        }
    }


    return (
        <div className="ml-4 mt-3 mb-3">
            <div className="packages-head font-weight-bold">
                <div className="d-inline-block" style={{width: "200px"}}>Name</div>
                <div className="d-inline-block" style={{width: "120px"}}>Severity <i className="bi bi-sort-down" id="Severity" onClick={handleClick}></i></div>
                <div className="d-inline-block" style={{width: "250px"}}>Resource</div>
                <div className="d-inline-block" style={{width: "110px",textAlign: "center"}}>CVSSv3 <i className="bi bi-sort-down" id="CVSSv3" onClick={handleClick}></i></div>
                <div className="d-inline-block" style={{width: "170px"}}>Installed Version</div>
                <div className="d-inline-block" style={{width: "150px"}}>Fix Version</div>
            </div>
        </div>
    )
}


const VulnList = (props) => {
    const [vulns, setVulns] = useState(props.vulns)

    const handleSort = (column, direction) => {
        let sorted = [];

        if(column == "CVSSv3" || column == "CVSSv2") {

            let lookup = column == "CVSSv3" ? 'V3Score' : 'V2Score';

            if(direction == "desc"){
                sorted = [...vulns].sort((a, b) => {
                    if(a?.CVSS?.nvd[lookup]  === undefined){
                        return -1;
                    }else{
                       return  a?.CVSS?.nvd[lookup] < b?.CVSS?.nvd[lookup] ? -1 : 1
                    }
                }
                )
            }else{
                sorted = [...vulns].sort((a, b) => {
                    if(b?.CVSS?.nvd[lookup] === undefined){
                        return -1
                    }else{
                        return a?.CVSS?.nvd[lookup] < b?.CVSS?.nvd[lookup] ? 1 : -1
                    }
                })
            }
            setVulns(sorted)
        }else if(column == "Severity"){
            if(direction == "desc") {
                sorted = [...vulns].sort((a, b) => order[a.Severity] - order[b.Severity]);
            }else{
                sorted = [...vulns].sort((a, b) => order[b.Severity] - order[a.Severity]);
            }
            setVulns(sorted)
        }
    }


    return (
        <>
        
            <VulnHeader onSort={handleSort} />

            {vulns.length > 0 ?

                vulns.map((vuln, j) => (
                    <Vuln {...vuln} key={j}/>
                ))
            :
                <div className="ml-4 mt-2">No vulnerabilities found</div>
            }

        </>
    )
}

const Resources = (props) => {

    const [visibleRow, setVisibleRow] = useState(-1)

    function showResourceInfo(rowIndex){
        if(visibleRow == rowIndex){
            setVisibleRow(-1)
        }else{
            setVisibleRow(rowIndex)
        }
    }


    return (
        <>
            <div className="ml-4 mt-3 mb-3 packages-head font-weight-bold">
                <div className="d-inline-block" style={{width: "200px"}}>Resource</div>
                <div className="d-inline-block" style={{width: "120px"}}>Type</div>
                <div className="d-inline-block" style={{width: "150px"}}>Version</div>
                <div className="d-inline-block text-center" style={{width: "120px"}}>Vulnerabilities</div>
                <div className="d-inline-block text-center" style={{width: "120px"}}>Risk Summary</div>
            </div>

            {props.list.map((resource, k) => (
                <div key={k} >
                    <div className="ml-4 " onClick={() => showResourceInfo(k)}>
                        <div className="d-inline-block" style={{width: "200px"}}><i className="bi bi-play-fill"></i>  {resource.name}</div>
                        <div className="d-inline-block" style={{width: "120px"}}>{resource.type}</div>
                        <div className="d-inline-block" style={{width: "150px"}}>{resource.installed_version}</div>
                        <div className="d-inline-block text-center" style={{width: "120px"}}>{resource.vulnerabilities.length}</div>
                        <div className="d-inline-block mt-1 mb-1 ">
                            <div className="d-inline-block critical tile mr-1">{resource.severity_counts.CRITICAL}</div>
                            <div className="d-inline-block high tile mr-1">{resource.severity_counts.HIGH}</div>
                            <div className="d-inline-block medium tile mr-1">{resource.severity_counts.MEDIUM}</div>
                            <div className="d-inline-block low tile mr-1">{resource.severity_counts.LOW}</div>
                            <div className="d-inline-block info tile mr-1">{resource.severity_counts.UNKNOWN}</div>
                        </div>
                    </div>

                    {visibleRow === k &&
                    <div className="mt-2 mb-2">
                        <div className="font-weight-bold ml-4">
                            <div className="d-inline-block ml-4 " style={{width: "140px"}}>Name</div>
                            <div className="d-inline-block" style={{width: "120px"}}>Severity</div>
                            <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>CVSSv3</div>
                            <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>CVSSv2</div>
                            <div className="d-inline-block" style={{width: "200px"}}>Fix Version</div>
                        </div>
                        {props.list[k].vulnerabilities.map((cve, i) => (
                            <div className="ml-4 mt-1 mb1" key={i}>
                                <div className="d-inline-block ml-4" style={{width: "140px"}}><a href={cve.link} target="_blank">{cve.VulnerabilityID}</a></div>
                                <div className="d-inline-block" style={{width: "120px"}}><Severity color={cve.Severity}>{cve.Severity}</Severity></div>
                                <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>{cve?.CVSS?.nvd?.V3Score}</div>
                                <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>{cve?.CVSS?.nvd?.V2Score}</div>
                                <div className="d-inline-block" style={{width: "200px"}}>{cve.FixedVersion}</div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            ))}
        </>
    )
}

const Layers = () => {

    const [visibleRow, setVisibleRow] = useState(0)
    const [visibleVulnsRow, setVisibleVulnsRow] = useState(0)

    function showLayerInfo(rowIndex){
        if(visibleRow == rowIndex){
            setVisibleRow(0)
            setVisibleVulnsRow(0)

        }else{
            setVisibleRow(rowIndex)
            setVisibleVulnsRow(0)
        }
    }

    function showVulnLayerInfo(rowIndex){
        visibleVulnsRow == rowIndex ? setVisibleVulnsRow(0) : setVisibleVulnsRow(rowIndex)
    }

    const openCreatedBy = (index) => {
        let createdBy = document.getElementById(`createdBy-${index}`);
        let classes = createdBy.className
        if(classes.includes("d-none")){
            createdBy.classList.add("d-inline");
            createdBy.classList.remove("d-none");
            
        }else{
            createdBy.classList.remove("d-inline");
            createdBy.classList.add("d-none");
        }
    }

    return (
        <div className="mt-4">
            <h5>Image Layers</h5>

            { layers.map( (layer, index) => (
                <div key={index + 1}>

                    <div className="row-cont" onClick={function test(){ showLayerInfo(index + 1)}} style={{"marginBottom": "25px"}}>
                        <div>{layer.packages?.length > 0 ? <i className="bi bi-play-fill"></i> : <>&nbsp;&nbsp;&nbsp;&nbsp;</>}  <b>{layer.diff_id}</b><div style={{"marginLeft":"18px"}}>Created by: {truncateString(layer.command, 250)}</div></div>
                    </div>

                    { visibleRow === (index + 1) ?
                        <div className="ml-4 mt-3 mb-3" key={0}>
                            <div className="packages-head font-weight-bold">
                                <div className="d-inline-block w-25">Name</div>
                                <div className="d-inline-block w-25">Type</div>
                                <div className="d-inline-block w-25">Version</div>
                                <div className="d-inline-block w-25">Vulnerabilities</div>
                            </div>
                            {layer.packages?.map((pack, i) => (
                                <div>
                                    <div className="package-cont ml-1" key={i + 1} onClick={function test(){ showVulnLayerInfo(i + 1)}}>
                                        <div className="d-inline-block w-25"><i className="bi bi-play-fill"></i>  {pack.name}</div>
                                        <div className="d-inline-block w-25">{pack.type}</div>
                                        <div className="d-inline-block w-25">{pack.version}</div>
                                        <div className="d-inline-block w-25">{pack.vulnerabilities?.length}</div>
                                    </div>

                                    { visibleRow === (index + 1) && visibleVulnsRow === (i + 1) ?
                                        <div className="ml-4 mt-3 mb-3" key={0}>
                                            <div className="vulns-head font-weight-bold">
                                                <div className="d-inline-block w-25">Name</div>
                                                <div className="d-inline-block w-25">Severity</div>
                                                <div className="d-inline-block w-25">Score</div>
                                                <div className="d-inline-block w-25">Fix Version</div>
                                            </div>

                                            {pack.vulnerabilities?.map((vuln, j) => (
                                                <div className="vulns-cont mt-1 mb-1">
                                                    <div className="d-inline-block w-25"><a href="" target="_blank">{vuln.PkgName}</a></div>
                                                    <div className="d-inline-block w-25"><Severity color={vuln.Severity}>{vuln.Severity}</Severity></div>
                                                    <div className="d-inline-block w-25">{vuln.CVSS?.nvd?.V3Score}</div>
                                                    <div className="d-inline-block w-25">{vuln.FixedVersion}</div>
                                                    <div></div>
                                                </div>
                                            ))}

                                           
                                            
                                        </div>
                                        
                                        :
                                        null

                                    }

                                </div>
                            ))}
                           
                            
                        </div>
                        :
                        null
                    }
                </div>
            ))}

        </div>
    )
}

const Fixable = () => {
    const [fixable, setFixable] = useState([])
    const [groupBy, setGroupBy] = useState(false)
    const [resources, setResources] = useState([])


    function groupByResource() {
        for(let resource of fixable){
            let found = resources.find(r => resource.package === r.name)
            if(found == undefined){
                resources.push({name: resource.package, installed_version: resource.installed_version, vulnerabilities: [resource], type: resource.type})
            }
            else{
                found.vulnerabilities.push(resource)
            }
        }

        resources.forEach( r => {
            let severityCounts = {CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0}
            r.vulnerabilities.map( cve => { severityCounts[cve.Severity] += 1 })
            r.severity_counts = severityCounts

        })
        setResources([...resources].sort((a, b) => a.vulnerabilities.length > b.vulnerabilities.length ? -1 : 1))
    }

    function handleGroupByClick(){
        setGroupBy(!groupBy)
    }

    function getFixable(){
        
        for(let layer of layers){
            if('packages' in layer){
                for(let pack  of layer.packages){
                    let fixes = pack.vulnerabilities.flatMap( vuln => {
                        if(vuln.FixedVersion !== "" && vuln.FixedVersion != undefined){
                            return {"package": pack.name, type: pack.type, "installed_version": pack.version, ...vuln }
                        }else{
                            return []
                        }
                    })
                    if(fixes.length > 0){
                        fixable.push(...fixes)
                    }

                }
            }
        }
        fixable.sort((a, b) => order[b.Severity] - order[a.Severity])
        setFixable([...fixable])
    }

    useEffect( () => {
        getFixable()
        groupByResource()
    }, [])

    return(
        <>
        <div className="mt-3 ml-4"><input type="checkbox" checked={groupBy}  onChange={handleGroupByClick}/> Group by resource</div>

            {groupBy ?
                <Resources list={resources}/>
                :
                //If not group by
                <div className="mt-5">
                    <VulnList vulns={fixable} />
                </div>
            }
        </>
    )
}

const All = () => {

    const [loading, setLoading] = useState(true)
    const [vulns, setVulns] = useState([])
    const [resources, setResources] = useState([])
    const [allVulns, setAllVuns] = useState([])
    const [groupBy, setGroupBy] = useState(false)

    function getVulns(){
        for(let layer of layers){
            if('packages' in layer){
                for(let p of layer.packages){
                    let found = resources.find(r => (p.name === r.name) && (p.installed_version == r.installed_version))
                    if(found == undefined){
                        resources.push({name: p.name, installed_version: p.version, vulnerabilities: p.vulnerabilities, type: p.type})

                        for(let vuln of p.vulnerabilities){
                            allVulns.push({name: p.name, package: p.name, installed_version: p.version, type: p.type, ...vuln})
                        }
                    }
                    else{
                        found.vulnerabilities.push(p.vulnerabilities)
                    }
                }
            }

        }

        allVulns.sort((a, b) => order[b.Severity] - order[a.Severity])
        resources.forEach( r => {
            let severityCounts = {Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0}
            r.vulnerabilities.map( cve => { severityCounts[cve.severity] += 1 })
            r.severity_counts = severityCounts

        })

        setResources([...resources].sort((a, b) => a.vulnerabilities.length > b.vulnerabilities.length ? -1 : 1))


    }

    function handleGroupByClick(){
        setGroupBy(!groupBy)
    }




    useEffect( () => {
        getVulns()
        setLoading(false)
    }, [])


    return (
        <>
            <div className="mt-3 ml-4"><input type="checkbox" checked={groupBy}  onChange={handleGroupByClick}/> Group by resource</div>

            {groupBy ?
                <Resources list={resources}/>
                :
                <div className="mt-5">
                    <VulnList vulns={allVulns} />
                </div>
            }
        </>
    )
}

const App = () => {

    const [active, setActive] = useState("fixable")

    const handleTabClick = (event) => {
        setActive(event.target.id)
        let id = event.target.id
        let fix = document.getElementById("fixable");
        let all = document.getElementById("all");
        let layers = document.getElementById("layers");

        if(id == "layers"){
            fix.classList.remove("active");
            all.classList.remove("active");
        }else if(id == "fixable"){
            layers.classList.remove("active");
            all.classList.remove("active");
        }else{
            layers.classList.remove("active");
            fix.classList.remove("active");
        }

        event.target.classList.add("active");

    }

    const renderDisplay = () => {
       if(active == "layers"){
          return <Layers/>
        }else 
        if(active == "fixable"){
            return <Fixable />
        }else{
           return <All />
       }

    }



    return (
        <>
        <div className="row" style={{"marginTop": "0px"}}>
            <div className="col-md-12">

                <div style={{"display": "inlineBlock", "float": "right","marginTop":"-10px","marginRight": "-20px"}}>
                    <img src="https://www.lacework.com/wp-content/uploads/2019/07/Lacework_Logo_color_2019.svg" width="350px" height="150px"></img>
                </div>
                <h1 style={{"marginTop": "23px", "fontSize": "30px"}}>{scan_result[0].Target}</h1>

                <table>
            <tbody>
                <tr><td>Type</td><td>{scan_result[0].Type}</td></tr>
                <tr><td>Scan Time:</td><td>{scan_result[0].Timer}</td></tr>
                <tr><td>Digest</td><td>{scan_result[0].Manifest.config.digest}</td></tr>
                <tr><td>Size</td><td>{scan_result[0].Manifest.config.size}</td></tr>
            </tbody>
            </table>

            </div>
        </div>

        { scan_result[0].ScanResult?.result?.reason ?
        <div className="row" style={{"marginTop": "75px"}}>
        <div style={{"display": "inline-block", "marginTop": "25px",  "marginLeft": "15px"}}>
        <div style={{"fontSize": "14px"}}>
        <h5>OPA Policy Decision</h5>
            <b>Decision ID:</b> {scan_result[0].ScanResult?.decision_id}<br/>
            <b>Allowed:</b> <span className={scan_result[0].ScanResult?.result?.allowed ? "green" : "failed"}>{scan_result[0].ScanResult?.result?.allowed.toString()}</span>
            <br/><b>Reason:</b></div>
        
            {scan_result[0].ScanResult?.result?.reason.map((reason, index) => (
            
            <div key={index}> {reason}</div>
            ))}
                
            
            </div>
            <div style={{"display": "inline-block", "verticalAlign": "top", "marginLeft": "125px", "marginTop":"20px", "marginBottom":"15px"}}>
                <img src="https://d33wubrfki0l68.cloudfront.net/5305a470ca0260247560b4f94daf68ed62d4a514/85ceb/img/logos/opa-no-text-color.png" height="125px" width="125px"/>
            </div>
            <hr/>
        </div>
        :
        <></>
        }


        
        <div className="row" style={{"marginTop": "75px"}}>
        <div className="col-md-4">
            <h5>Risk Summary - Vulnerabilities</h5> <i className="fas fa-sort-amount-up-alt"></i>

            <table>
                <tbody>
                <tr><td>Total</td><td style={{"textAlign": "center"}}>{scan_result[0].total_vulnerabilities}</td></tr>
                <tr><td>Fixable</td><td style={{"textAlign": "center"}}>{scan_result[0].fixable_vulnerabilities}</td></tr>
                <tr><td>Critical</td><td><div className="critical tile">{scan_result[0].critical_vulnerabilities}</div></td></tr>
                <tr><td>High</td><td><div className="high tile">{scan_result[0].high_vulnerabilities}</div></td></tr>
                <tr><td>Medium</td><td><div className="medium tile">{scan_result[0].medium_vulnerabilities}</div></td></tr>
                <tr><td>Low</td><td ><div className="low tile">{scan_result[0].low_vulnerabilities}</div></td></tr>
                <tr><td>Info</td><td><div className="info tile">{scan_result[0].unknown_vulnerabilities}</div></td></tr>
                </tbody>


            </table>

        </div>
   
        </div>


        <div className="row" style={{"marginTop": "75px"}}>
        <div className="mb-10">
            <ul className="nav nav-tabs">
                <li className="nav-item"><a className="nav-link active" id="fixable" href="#" onClick={handleTabClick}>Fixable</a></li>
               <li className="nav-item"><a className="nav-link" id="layers" href="#" onClick={handleTabClick}>By Layers</a></li>
                <li className="nav-item"><a className="nav-link" id="all" href="#" onClick={handleTabClick}>All</a></li>
            </ul>

            {renderDisplay()}
            <br/><br/><br/><br/>
        </div>
        </div>
        </>
    )
}


ReactDOM.render(<App />, document.getElementById('app'));