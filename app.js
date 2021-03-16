import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';


const order = { Critical: 5, High: 4, Medium: 3, Low: 2, Info: 1 };

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
            <div className="d-inline-block" style={{width: "140px"}}><a href={props.link} target="_blank">{props.name}</a></div>
            <div className="d-inline-block" style={{width: "120px"}}><Severity color={props.severity}>{props.severity}</Severity></div>
            <div className="d-inline-block" style={{width: "120px"}}>{props.package}</div>
            <div className="d-inline-block" style={{width: "110px", textAlign: "center"}}>{props.metadata.NVD.CVSSv3.Score}</div>
            <div className="d-inline-block" style={{width: "110px", textAlign: "center"}}>{props.metadata.NVD.CVSSv2.Score}</div>
            <div className="d-inline-block" style={{width: "150px"}}>{props.installed_version}</div>
            <div className="d-inline-block" style={{width: "150px"}}>{props.fix_version}</div>
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
                <div className="d-inline-block" style={{width: "140px"}}>Name</div>
                <div className="d-inline-block" style={{width: "120px"}}>Severity <i className="bi bi-sort-down" id="Severity" onClick={handleClick}></i></div>
                <div className="d-inline-block" style={{width: "120px"}}>Resource</div>
                <div className="d-inline-block" style={{width: "110px",textAlign: "center"}}>CVSSv3 <i className="bi bi-sort-down" id="CVSSv3" onClick={handleClick}></i></div>
                <div className="d-inline-block" style={{width: "110px", textAlign: "center"}}>CVSSv2 <i className="bi bi-sort-down" id="CVSSv2" onClick={handleClick}></i></div>
                <div className="d-inline-block" style={{width: "150px"}}>Installed Version</div>
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

            if(direction == "desc"){
                sorted = [...vulns].sort((a, b) => a.metadata.NVD[column].Score < b.metadata.NVD[column].Score ? -1 : 1)
            }else{
                sorted = [...vulns].sort((a, b) => a.metadata.NVD[column].Score < b.metadata.NVD[column].Score ? 1 : -1)
            }
            setVulns(sorted)
        }else if(column == "Severity"){
            if(direction == "desc") {
                sorted = [...vulns].sort((a, b) => order[a.severity] - order[b.severity]);
            }else{
                sorted = [...vulns].sort((a, b) => order[b.severity] - order[a.severity]);
            }
            setVulns(sorted)
        }
    }

    return (
        <>
            <VulnHeader onSort={handleSort} />
            {   vulns.map((vuln, j) => (
                <Vuln {...vuln} key={j}/>
            ))
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
                <div className="d-inline-block" style={{width: "120px"}}>Resource</div>
                <div className="d-inline-block" style={{width: "120px"}}>Type</div>
                <div className="d-inline-block" style={{width: "120px"}}>Version</div>
                <div className="d-inline-block text-center" style={{width: "120px"}}>Vulnerabilities</div>
                <div className="d-inline-block text-center" style={{width: "120px"}}>Risk Summary</div>
            </div>

            {props.list.map((resource, k) => (
                <div key={k} >
                    <div className="ml-4 " onClick={() => showResourceInfo(k)}>
                        <div className="d-inline-block" style={{width: "120px"}}><i className="bi bi-play-fill"></i>  {resource.name}</div>
                        <div className="d-inline-block" style={{width: "120px"}}>{resource.type}</div>
                        <div className="d-inline-block" style={{width: "120px"}}>{resource.installed_version}</div>
                        <div className="d-inline-block text-center" style={{width: "120px"}}>{resource.vulnerabilities.length}</div>
                        <div className="d-inline-block mt-1 mb-1 ">
                            <div className="d-inline-block critical tile mr-1">{resource.severity_counts.Critical}</div>
                            <div className="d-inline-block high tile mr-1">{resource.severity_counts.High}</div>
                            <div className="d-inline-block medium tile mr-1">{resource.severity_counts.Medium}</div>
                            <div className="d-inline-block low tile mr-1">{resource.severity_counts.Low}</div>
                            <div className="d-inline-block info tile mr-1">{resource.severity_counts.Info}</div>
                        </div>
                    </div>

                    {visibleRow === k &&
                    <div className="mt-2 mb-2">
                        <div className="font-weight-bold ml-4">
                            <div className="d-inline-block ml-4 " style={{width: "140px"}}>Name</div>
                            <div className="d-inline-block" style={{width: "120px"}}>Severity</div>
                            <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>CVSSv3</div>
                            <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>CVSSv2</div>
                            <div className="d-inline-block" style={{width: "120px"}}>Fix Version</div>
                        </div>
                        {props.list[k].vulnerabilities.map((cve, i) => (
                            <div className="ml-4 mt-1 mb1" key={i}>
                                <div className="d-inline-block ml-4" style={{width: "140px"}}><a href={cve.link} target="_blank">{cve.name}</a></div>
                                <div className="d-inline-block" style={{width: "120px"}}><Severity color={cve.severity}>{cve.severity}</Severity></div>
                                <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>{cve.metadata.NVD.CVSSv3.Score}</div>
                                <div className="d-inline-block" style={{width: "120px", textAlign: "center"}}>{cve.metadata.NVD.CVSSv2.Score}</div>
                                <div className="d-inline-block" style={{width: "120px"}}>{cve.fix_version}</div>
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

    return (
        <div className="mt-4">
            <h5>Image Layers</h5>

            { layers.map( (layer, index) => (
                <div key={index + 1}>

                    <div className="row-cont" onClick={function test(){ showLayerInfo(index + 1)}}>
                        <div className="float-right">{truncateString(layer.created_by, 55)}</div>
                        <div><i className="bi bi-play-fill"></i>  {layer.hash}</div>
                    </div>

                    { visibleRow === (index + 1) ?
                        <div className="ml-4 mt-3 mb-3" key={0}>
                            <div className="packages-head font-weight-bold">
                                <div className="d-inline-block w-25">Name</div>
                                <div className="d-inline-block w-25">Namespace</div>
                                <div className="d-inline-block w-25">Version</div>
                                <div className="d-inline-block w-25">Vulnerabilities</div>
                            </div>
                            {layer.packages.map((pack, i) => (
                                <div>
                                    <div className="package-cont ml-1" key={i + 1} onClick={function test(){ showVulnLayerInfo(i + 1)}}>
                                        <div className="d-inline-block w-25"><i className="bi bi-play-fill"></i>  {pack.name}</div>
                                        <div className="d-inline-block w-25">{pack.namespace}</div>
                                        <div className="d-inline-block w-25">{pack.version}</div>
                                        <div className="d-inline-block w-25">{pack.vulnerabilities.length}</div>
                                    </div>

                                    { visibleRow === (index + 1) && visibleVulnsRow === (i + 1) ?
                                        <div className="ml-4 mt-3 mb-3" key={0}>
                                            <div className="vulns-head font-weight-bold">
                                                <div className="d-inline-block w-25">Name</div>
                                                <div className="d-inline-block w-25">Severity</div>
                                                <div className="d-inline-block w-25">Score</div>
                                                <div className="d-inline-block w-25">Fix Version</div>
                                            </div>

                                            {pack.vulnerabilities.map((vuln, j) => (
                                                <div className="vulns-cont mt-1 mb-1">
                                                    <div className="d-inline-block w-25"><a href={vuln.link} target="_blank">{vuln.name}</a></div>
                                                    <div className="d-inline-block w-25"><Severity color={vuln.severity}>{vuln.severity}</Severity></div>
                                                    <div className="d-inline-block w-25">{vuln.metadata.NVD.CVSSv3.Score}</div>
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
    const [loading, setLoading] = useState(true)
    const [groupBy, setGroupBy] = useState(false)
    const [resources, setResources] = useState([])



    function groupByResource() {
        for(let resource of fixable){
            let found = resources.find(r => resource.package === r.name)
            if(found == undefined){
                resources.push({name: resource.package, installed_version: resource.installed_version, vulnerabilities: [resource], type: "package"})
            }
            else{
                found.vulnerabilities.push(resource)
            }
        }

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

    function getFixable(){
        for(let layer of layers){
            for(let pack of layer.packages){
                let fixes = pack.vulnerabilities.flatMap( vuln => {
                    if(vuln.fix_version !== ""){
                        return {"package": pack.name, "installed_version": pack.version,...vuln }
                    }else{
                        return []
                    }
                })
                if(fixes.length > 0){
                    fixable.push(...fixes)
                }

            }
        }
        fixable.sort((a, b) => order[b.severity] - order[a.severity])
    }

    useEffect( () => {
        getFixable()
        groupByResource()
        setLoading(false)
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
            for(let p of layer.packages){
                let found = resources.find(r => (p.name === r.name) && (p.installed_version == r.installed_version))
                if(found == undefined){
                    resources.push({name: p.name, installed_version: p.version, vulnerabilities: p.vulnerabilities, type: "package"})

                    for(let vuln of p.vulnerabilities){
                        allVulns.push({name: p.name, package: p.name, installed_version: p.version, type: "package", ...vuln})
                    }
                }
                else{
                    found.vulnerabilities.push(p.vulnerabilities)
                }
            }

        }

        allVulns.sort((a, b) => order[b.severity] - order[a.severity])
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
        }else if(active == "fixable"){
            return <Fixable />
        }else{
            return <All />
        }

    }


    return (
        <div className="mb-10">
            <ul className="nav nav-tabs">
                <li className="nav-item"><a className="nav-link active" id="fixable" href="#" onClick={handleTabClick}>Fixable</a></li>
                <li className="nav-item"><a className="nav-link" id="layers" href="#" onClick={handleTabClick}>By Layers</a></li>
                <li className="nav-item"><a className="nav-link" id="all" href="#" onClick={handleTabClick}>All</a></li>
            </ul>

            {renderDisplay()}
            <br/><br/><br/><br/>
        </div>
    )
}


ReactDOM.render(<App />, document.getElementById('app'));