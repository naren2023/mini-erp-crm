import { Link } from "react-router-dom";
import { Button, FormInput, Select, DataTable, Badge, Pagination, LoadingSpinner } from "../components";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, type FormEvent } from "react";
import { addFollowUp, createCustomer, deleteCustomer, getCustomer, listCustomers, updateCustomer } from "../services/customer.service";
import type { Customer, CustomerStatus, CustomerType, Pagination as PageInfo } from "../types";
import { formatDate } from "../utils/format";

const types: CustomerType[] = ["RETAIL","WHOLESALE","DISTRIBUTOR"];
const statuses: CustomerStatus[] = ["LEAD","ACTIVE","INACTIVE"];

export function CustomersPage() {
  const { notify } = useToast(); const { user } = useAuth();
  const [items,setItems]=useState<Customer[]>([]); const [pagination,setPagination]=useState<PageInfo>({page:1,limit:10,total:0,totalPages:1});
  const [search,setSearch]=useState(""); const [status,setStatus]=useState(""); const [page,setPage]=useState(1); const [loading,setLoading]=useState(true);
  async function load(){setLoading(true);try{const r=await listCustomers({page,limit:10,search:search||undefined,status:status||undefined});setItems(r.items);setPagination(r.pagination)}catch(e){notify((e as Error).message,"error")}finally{setLoading(false)}}
  useEffect(()=>{load()},[page,search,status]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-slate-500">{pagination.total} customers</p><h2 className="text-xl font-semibold text-navy-900">Customer CRM</h2></div>{user?.role!=="ACCOUNTS"&&<Link to="/customers/new"><Button>+ Add customer</Button></Link>}</div>
    <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><FormInput label="Search" placeholder="Name, business or email" value={search} onChange={e=>{setPage(1);setSearch(e.target.value)}}/><Select label="Status" value={status} onChange={e=>{setPage(1);setStatus(e.target.value)}} options={[{label:"All statuses",value:""},...statuses.map(x=>({label:x,value:x}))]}/></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{loading?<LoadingSpinner/>:<DataTable columns={[
      {key:"name",header:"Customer",render:c=><Link className="font-semibold text-teal-700" to={`/customers/${c.id}`}>{c.name}</Link>},
      {key:"business",header:"Business",render:c=><span>{c.businessName}</span>},
      {key:"type",header:"Type",render:c=><span>{c.customerType}</span>},
      {key:"mobile",header:"Mobile",render:c=><span>{c.mobile}</span>},
      {key:"status",header:"Status",render:c=><Badge value={c.status}/>},
      {key:"follow",header:"Follow-up",render:c=><span>{formatDate(c.followUpDate)}</span>},
    ]} data={items} emptyMessage="No customers found"/>}</div>
    <Pagination {...pagination} onChange={setPage}/>
  </div>;
}

export function CustomerFormPage() {
  const {notify}=useToast(); const navigate=__nav();
  const [form,setForm]=useState({name:"",mobile:"",email:"",businessName:"",gstNumber:"",customerType:"WHOLESALE" as CustomerType,status:"LEAD" as CustomerStatus,address:"",followUpDate:"",notes:""}); const [loading,setLoading]=useState(false);
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);try{await createCustomer({...form,followUpDate:form.followUpDate||null,gstNumber:form.gstNumber||null});notify("Customer created","success");navigate("/customers")}catch(e){notify((e as Error).message,"error")}finally{setLoading(false)}}
  return <CustomerForm title="Add customer" form={form} set={set} submit={submit} loading={loading}/>;
}

export function CustomerEditPage() { const {id}=__params(); const {notify}=useToast(); const navigate=__nav(); const [form,setForm]=useState<Record<string,string>>({name:"",mobile:"",email:"",businessName:"",gstNumber:"",customerType:"WHOLESALE",status:"LEAD",address:"",followUpDate:"",notes:""}); const [loading,setLoading]=useState(true); useEffect(()=>{getCustomer(id).then(c=>setForm({name:c.name,mobile:c.mobile,email:c.email,businessName:c.businessName,gstNumber:c.gstNumber||"",customerType:c.customerType,status:c.status,address:c.address,followUpDate:c.followUpDate?c.followUpDate.slice(0,10):"",notes:c.notes||""})).catch(e=>notify((e as Error).message,"error")).finally(()=>setLoading(false))},[id]); const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v})); async function submit(e:FormEvent){e.preventDefault();try{await updateCustomer(id,{...form,followUpDate:form.followUpDate||null,gstNumber:form.gstNumber||null});notify("Customer updated","success");navigate(`/customers/${id}`)}catch(e){notify((e as Error).message,"error")}} if(loading)return <LoadingSpinner/>; return <CustomerForm title="Edit customer" form={form} set={set} submit={submit} loading={false}/>; }

export function CustomerDetailPage() {
  const {id}=__params(); const {notify}=useToast(); const {user}=useAuth(); const navigate=__nav();
  const [c,setC]=useState<Customer|null>(null); const [loading,setLoading]=useState(true); const [note,setNote]=useState(""); const [date,setDate]=useState("");
  async function load(){try{setC(await getCustomer(id))}catch(e){notify((e as Error).message,"error")}finally{setLoading(false)}}
  useEffect(()=>{load()},[id]); if(loading)return <LoadingSpinner/>; if(!c)return <p>Customer not found.</p>;
  async function follow(e:FormEvent){e.preventDefault();try{await addFollowUp(id,{note,followUpDate:date});notify("Follow-up added","success");setNote("");setDate("");load()}catch(e){notify((e as Error).message,"error")}}
  async function remove(){if(!confirm("Delete this customer?"))return;try{await deleteCustomer(id);notify("Customer deleted","success");navigate("/customers")}catch(e){notify((e as Error).message,"error")}}
  return <div className="space-y-5"><div className="flex flex-wrap justify-between gap-3"><div><Link className="text-sm text-teal-700" to="/customers">← Customers</Link><h2 className="mt-2 text-2xl font-semibold">{c.name}</h2><p className="text-slate-500">{c.businessName} · {c.customerType}</p></div><div className="flex gap-2">{user?.role!=="ACCOUNTS"&&<Link to={`/customers/${id}/edit`}><Button variant="secondary">Edit</Button></Link>}{user?.role==="ADMIN"&&<Button variant="danger" onClick={remove}>Delete</Button>}</div></div>
  <div className="grid gap-4 lg:grid-cols-3"><Info label="Mobile" value={c.mobile}/><Info label="Email" value={c.email}/><Info label="GST" value={c.gstNumber||"—"}/><Info label="Status" value={c.status}/><Info label="Address" value={c.address}/><Info label="Next follow-up" value={formatDate(c.followUpDate)}/></div>
  <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="font-semibold">Notes</h3><p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{c.notes||"No notes."}</p></section>
  <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="font-semibold">Add follow-up</h3>{user?.role!=="ACCOUNTS"&&<form onSubmit={follow} className="mt-4 space-y-3"><FormInput label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} required/><FormInput label="Note" value={note} onChange={e=>setNote(e.target.value)} required/><Button>Add follow-up</Button></form>}</section></div>
  <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="font-semibold">Follow-up history</h3><div className="mt-4 space-y-3">{(c.followUps||[]).map(f=><div key={f.id} className="rounded-xl bg-slate-50 p-3"><div className="flex justify-between text-xs text-slate-500"><span>{formatDate(f.followUpDate)}</span><span>{f.creator?.name||"User"}</span></div><p className="mt-1 text-sm">{f.note}</p></div>)}</div></section></div>;
}

function CustomerForm({title,form,set,submit,loading}:{title:string;form:Record<string,string>;set:(k:string,v:string)=>void;submit:(e:FormEvent)=>void;loading:boolean}){
 return <form onSubmit={submit} className="max-w-4xl space-y-5"><div><h2 className="text-2xl font-semibold">{title}</h2><p className="text-sm text-slate-500">Capture the CRM record and next follow-up.</p></div><div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:grid-cols-2">
 {(["name","mobile","email","businessName","gstNumber","address","followUpDate","notes"] as const).map(k=><FormInput key={k} label={k==="gstNumber"?"GST number (optional)":k.replace(/([A-Z])/g," $1")} type={k==="followUpDate"?"date":"text"} value={form[k]} onChange={e=>set(k,e.target.value)} required={!["gstNumber","followUpDate","notes"].includes(k)}/>)}
 <Select label="Customer type" value={form.customerType} onChange={e=>set("customerType",e.target.value)} options={types.map(x=>({label:x,value:x}))}/>
 <Select label="Status" value={form.status} onChange={e=>set("status",e.target.value)} options={statuses.map(x=>({label:x,value:x}))}/>
 </div><div className="flex gap-2"><Link to="/customers"><Button variant="secondary">Cancel</Button></Link><Button disabled={loading}>{loading?"Saving...":"Save customer"}</Button></div></form>;
}
function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-slate-100 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium">{value}</p></div>}
function __nav(){return __useNavigate()} function __params(){return __useParams()}
import { useNavigate as __useNavigate, useParams as __useParams } from "react-router-dom";
